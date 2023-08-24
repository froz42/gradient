import { HttpException, Inject, Injectable } from '@nestjs/common';
import { VoiceBasedChannel } from 'discord.js';
import play from 'play-dl';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { DiscordPlayer } from './models/discord-player.model';
import { Song } from './models/song.model';
import { PUB_SUB } from 'src/pub-sub/pub-sub.module';
import { PubSub } from 'graphql-subscriptions';
import { DiscordPlayerSubscriptionPayload } from './types/discord-player-subscription-payload.type';
import ytdl, { Author } from 'ytdl-core';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { ChannelSearchService } from 'src/channel-search/channel-search.service';
import videoInfoToSong from 'src/utils/video-info-to-song';
import { PlaylistPage } from 'src/playlist/models/playlist-page.model';
import videoToSong from 'src/utils/video-to-song';
import throwExpression from 'src/utils/throw-expression';

type ChannelQueue = {
  songIdIndex: number;
  channel: VoiceBasedChannel;
  queue: Song[];
  currentQueueIndex: number;
  player?: AudioPlayer;
  connection?: VoiceConnection;
  seekTime?: number;
  startedAt?: number;
  nextAutoPlay?: Song & {
    fromVideoId: string;
  };
  loop?: boolean;
};

const PLAYER_OPTIONS = {};

@Injectable()
export class DiscordPlayerService {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly channelSearchService: ChannelSearchService,
  ) {}
  // Guild ID -> ChannelQueue
  private readonly queue: Map<string, ChannelQueue> = new Map();

  private initPlayer(queue: ChannelQueue) {
    const { channel } = queue;
    const player = createAudioPlayer();
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.subscribe(player);
    player.on('stateChange', (_, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        this.playNext(channel.guild.id);
      } else this.sendUpdate(channel.guild.id);
    });
    queue.player = player;
    queue.connection = connection;
    return player;
  }

  private sendUpdate(guildId: string) {
    const queue = this.queue.get(guildId);
    if (
      !queue ||
      queue.seekTime ||
      queue.player?.state.status === AudioPlayerStatus.Buffering
    ) {
      return;
    }
    const discordPlayer = this.getDiscordPlayer(guildId);
    const payload: DiscordPlayerSubscriptionPayload = {
      discordPlayer,
      guildId,
    };
    this.pubSub.publish('discordPlayer', payload);
  }

  private generateSongIdIndex(guildId: string): string {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return '0';
    }
    return (queue.songIdIndex++).toString();
  }

  /**
   * This function is used to play a song instantly
   * if there is a song currently playing, it will add the song
   * at the top of the queue and skip to it
   * @param userPayload the user payload
   * @param url the url of the song
   */
  public async playSong(
    userPayload: UserPayload,
    url: string,
    preloaded?: Song,
  ) {
    const queue = this.queue.get(userPayload.guildId);
    const id = this.generateSongIdIndex(userPayload.guildId);
    const songInfo =
      preloaded ||
      videoInfoToSong(id, await ytdl.getBasicInfo(url), userPayload);
    if (!queue) {
      const channel = await this.channelSearchService.searchChannel(
        userPayload.guildId,
        userPayload.id,
      );
      if (!channel) {
        throw new HttpException(
          'You must be in a voice channel to use this command',
          400,
        );
      }
      const newQueue: ChannelQueue = {
        songIdIndex: 1,
        channel,
        queue: [songInfo],
        currentQueueIndex: 0,
      };
      this.initPlayer(newQueue);
      this.queue.set(userPayload.guildId, newQueue);
      const stream = await play.stream(songInfo.url, PLAYER_OPTIONS);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      newQueue.player?.play(resource);
    } else {
      queue.queue.splice(queue.currentQueueIndex + 1, 0, songInfo);
      queue.seekTime = undefined;
      queue.startedAt = undefined;
      if (!queue.player) {
        const player = this.initPlayer(queue);
        const stream = await play.stream(songInfo.url, PLAYER_OPTIONS);
        const resource = createAudioResource(stream.stream, {
          inputType: stream.type,
        });
        player.play(resource);
      } else {
        if (queue.player.state.status === AudioPlayerStatus.Paused) {
          queue.player.unpause();
        }
        queue.player.stop();
      }
    }
  }

  public async queueAddFront(
    userPayload: UserPayload,
    url: string,
    preloaded?: Song,
  ) {
    const queue = this.queue.get(userPayload.guildId);
    if (!queue || !queue.player) {
      this.playSong(userPayload, url);
      return;
    }
    queue.queue.splice(
      queue.currentQueueIndex + 1,
      0,
      preloaded ||
        videoInfoToSong(
          this.generateSongIdIndex(userPayload.guildId),
          await ytdl.getBasicInfo(url),
          userPayload,
        ),
    );
    this.regenerateAutoPlay(userPayload.guildId);
    this.sendUpdate(userPayload.guildId);
  }

  public async queueAddBack(
    userPayload: UserPayload,
    url: string,
    preloaded?: Song,
  ) {
    const queue = this.queue.get(userPayload.guildId);
    if (!queue || !queue.player) {
      this.playSong(userPayload, url);
      return;
    }
    queue.queue.push(
      preloaded ||
        videoInfoToSong(
          this.generateSongIdIndex(userPayload.guildId),
          await ytdl.getBasicInfo(url),
          userPayload,
        ),
    );
    this.regenerateAutoPlay(userPayload.guildId);
    this.sendUpdate(userPayload.guildId);
  }

  private async playCurrentIndex(queue: ChannelQueue) {
    const nextSong = queue.queue[queue.currentQueueIndex] || queue.nextAutoPlay;
    if (!nextSong) {
      queue.player?.stop();
      queue.connection?.destroy();
      queue.player?.removeAllListeners();
      queue.player = undefined;
      queue.connection = undefined;
      return;
    }
    const stream = await play.stream(nextSong.url, {
      ...PLAYER_OPTIONS,
      seek: queue.seekTime,
    });
    queue.startedAt = queue.seekTime || 0;
    queue.seekTime = undefined;
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    if (!queue.player) {
      this.initPlayer(queue);
    }
    queue.player?.play(resource);
  }

  private playNext(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    if (!queue.seekTime && !queue.loop) {
      queue.currentQueueIndex++;
      if (queue.currentQueueIndex == queue.queue.length && queue.nextAutoPlay) {
        queue.queue.push(queue.nextAutoPlay);
      }
    }
    this.playCurrentIndex(queue);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(queue.channel.guild.id);
  }

  public skip(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue || !queue.player) {
      return;
    }
    queue.player?.stop();
  }

  public seek(guildId: string, seconds: number) {
    const queue = this.queue.get(guildId);
    if (!queue || !queue.player) {
      return;
    }
    // check if seconds is valid
    const currentSong = queue.queue[queue.currentQueueIndex];
    if (!currentSong) {
      return;
    }
    if (seconds <= 0 || seconds > currentSong.duration) {
      return;
    }
    queue.seekTime = seconds;
    queue.player?.stop();
  }

  public back(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.currentQueueIndex--;
    if (queue.currentQueueIndex < 0) {
      queue.currentQueueIndex = 0;
    }
    this.playCurrentIndex(queue);
  }

  public pause(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.player?.pause();
  }

  public resume(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.player?.unpause();
  }

  private getPlaybackDuration(queue: ChannelQueue) {
    if (!queue.player) {
      return 0;
    }
    if (queue.player.state.status === AudioPlayerStatus.Idle) {
      return 0;
    }
    return (
      queue.player.state.resource.playbackDuration +
      (queue.startedAt || 0) * 1000
    );
  }

  public getDiscordPlayer(guildId: string): DiscordPlayer {
    const queue = this.queue.get(guildId);
    if (!queue)
      return {
        playbackDuration: 0,
        currentQueueIndex: 0,
        queue: [],
        status: AudioPlayerStatus.Idle,
      };
    // get time of current song
    const playbackDuration = this.getPlaybackDuration(queue);
    const currentQueueIndex = queue.currentQueueIndex;
    return {
      playbackDuration: Math.round(playbackDuration / 1000),
      currentQueueIndex,
      queue: queue.queue,
      status: queue.player?.state.status || AudioPlayerStatus.Idle,
      nextAutoPlay: queue.nextAutoPlay,
      isLoopEnabled: queue.loop,
    };
  }

  public remove(guildId: string, index: number) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    if (index <= queue.currentQueueIndex) {
      return;
    }
    queue.queue.splice(index, 1);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  public move(guildId: string, from: number, to: number) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    // check if from and to are valid
    if (
      from === to ||
      from <= queue.currentQueueIndex ||
      to <= queue.currentQueueIndex ||
      from >= queue.queue.length ||
      to >= queue.queue.length
    ) {
      return;
    }
    const [removed] = queue.queue.splice(from, 1);
    queue.queue.splice(to, 0, removed);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  public removeFromQueue(guildId: string, index: number) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    if (index <= queue.currentQueueIndex) {
      return;
    }
    queue.queue.splice(index, 1);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  public clearQueue(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.queue.splice(queue.currentQueueIndex + 1);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  public async playPlaylist(
    userPayload: UserPayload,
    playlist: PlaylistPage,
    index: number,
    clearQueue: boolean,
  ) {
    const queue = this.queue.get(userPayload.guildId);
    const autoPlayingEnabled = !!queue?.nextAutoPlay;
    if (queue) queue.nextAutoPlay = undefined;
    if (clearQueue) this.clearQueue(userPayload.guildId);
    for (let i = index; i < playlist.videos.length; i++) {
      const video = playlist.videos[i];
      if (clearQueue && i === index) {
        await this.playSong(
          userPayload,
          video.url,
          videoToSong(
            this.generateSongIdIndex(userPayload.guildId),
            video,
            userPayload,
          ),
        );
        continue;
      }
      await this.queueAddBack(
        userPayload,
        video.url,
        videoToSong(
          this.generateSongIdIndex(userPayload.guildId),
          video,
          userPayload,
        ),
      );
    }
    this.regenerateAutoPlay(userPayload.guildId, autoPlayingEnabled);
    this.sendUpdate(userPayload.guildId);
  }

  private findBestRelatedSong(
    queue: Song[],
    relatedVideos: ytdl.relatedVideo[],
  ): ytdl.relatedVideo | undefined {
    const MAX_RELATED_SONG_LENGTH_SECONDS = 7 * 60;
    for (const relatedVideo of relatedVideos) {
      const lengthSeconds = relatedVideo.length_seconds || 0;
      if (lengthSeconds > MAX_RELATED_SONG_LENGTH_SECONDS) {
        continue;
      }
      const found = queue.find((song) => song.videoId === relatedVideo.id);
      if (!found) return relatedVideo;
    }
    return undefined;
  }

  private async regenerateAutoPlay(guildId: string, firstSetup = false) {
    const queue = this.queue.get(guildId);
    if (!queue) return;
    if (!firstSetup && !queue.nextAutoPlay) return; // do not regenerate if auto play is disabled
    const lastSong = queue.queue[queue.queue.length - 1];
    if (!lastSong) return;
    // avoid regenerating the next for the same song
    if (lastSong.videoId === queue.nextAutoPlay?.fromVideoId) return;
    const lastSongInfos = await ytdl.getInfo(lastSong.url, {
      lang: 'fr',
    });
    const nextAutoPlay = this.findBestRelatedSong(
      queue.queue,
      lastSongInfos.related_videos,
    );
    if (!nextAutoPlay) return;
    const author = nextAutoPlay.author as Author;
    queue.nextAutoPlay = {
      id: this.generateSongIdIndex(guildId),
      videoId: nextAutoPlay.id ?? throwExpression('No video ID'),
      title: nextAutoPlay.title ?? throwExpression('No title'),
      url: `https://www.youtube.com/watch?v=${nextAutoPlay.id}`,
      thumbnail: nextAutoPlay.thumbnails[0].url ?? '',
      duration: nextAutoPlay.length_seconds ?? 0,
      authorUrl: `https://www.youtube.com/channel/${author.id}`,
      authorName: author.name,
      authorId: author.id,
      authorAvatar: author.avatar ?? '',
      requestedBy: {
        id: '0',
        displayName: 'AutoPlay',
        avatar: '',
      },
      fromVideoId: lastSong.videoId,
    };
    this.sendUpdate(guildId);
  }

  public toggleAutoPlay(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) return;
    if (queue.nextAutoPlay) {
      queue.nextAutoPlay = undefined;
      this.sendUpdate(guildId);
      return;
    }
    queue.loop = false;
    this.regenerateAutoPlay(guildId, true);
  }

  public toggleLoop(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) return;
    queue.loop = !queue.loop;
    if (queue.loop) {
      queue.nextAutoPlay = undefined;
    }
    this.sendUpdate(guildId);
  }
}
