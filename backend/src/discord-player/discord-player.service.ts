import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { VoiceBasedChannel } from 'discord.js';
import play from 'play-dl';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
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
import { PLAYER_OPTIONS } from './consts/player-options.type';
import { ChannelQueue } from './types/channel-queue.type';
@Injectable()
export class DiscordPlayerService {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly channelSearchService: ChannelSearchService,
  ) {}
  // Guild ID -> ChannelQueue
  private readonly queue: Map<string, ChannelQueue> = new Map();

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

  public async handleVoiceChannelLeave(channel: VoiceBasedChannel) {
    if (channel.members.filter((member) => !member.user.bot).size > 0) return;
    const queue = this.queue.get(channel.guild.id);
    if (!queue) return;
    if (queue.managedPlayer?.channel.id === channel.id) {
      Logger.log(
        `Stopping player because no user in voice channel ${channel.id}`,
        this.constructor.name,
      );
      queue.managedPlayer.player.stop();
      queue.managedPlayer.player.removeAllListeners();
      queue.managedPlayer.connection.destroy();
      queue.managedPlayer = undefined;
      this.sendUpdate(channel.guild.id);
    }

    const isAUserInAVoiceChannel =
      await this.channelSearchService.isUserInVoiceChannel(channel.guild.id);
    if (isAUserInAVoiceChannel) return;
    Logger.log(
      'No user in a voice channel, clearing queue',
      this.constructor.name,
    );
    this.queue.delete(channel.guild.id);
    this.sendUpdate(channel.guild.id);
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
      const newQueue: ChannelQueue = {
        songIdIndex: 1,
        songs: [songInfo],
        currentQueueIndex: 0,
      };
      const player = await this.initPlayer(userPayload, newQueue);
      this.queue.set(userPayload.guildId, newQueue);
      // it's safe to assume that the player is defined since we just initialized it in the previous line
      this.playResource(songInfo.url, player);
    } else {
      queue.songs.splice(queue.currentQueueIndex + 1, 0, songInfo);
      queue.seekTime = undefined;
      queue.startedAt = undefined;
      if (!queue.managedPlayer) {
        const player = await this.initPlayer(userPayload, queue);
        this.playResource(songInfo.url, player);
      } else {
        const player = queue.managedPlayer.player;
        if (player.state.status === AudioPlayerStatus.Paused) {
          player.unpause();
        }
        player.stop();
      }
    }
  }

  public async queueAddFront(
    userPayload: UserPayload,
    url: string,
    preloaded?: Song,
  ) {
    const queue = this.queue.get(userPayload.guildId);
    if (!queue || !queue.managedPlayer) {
      this.playSong(userPayload, url);
      return;
    }
    queue.songs.splice(
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
    if (!queue || !queue.managedPlayer) {
      this.playSong(userPayload, url);
      return;
    }
    queue.songs.push(
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
      queue: queue.songs,
      status:
        queue.managedPlayer?.player.state.status || AudioPlayerStatus.Idle,
      nextAutoPlay: queue.nextAutoPlay,
      isLoopEnabled: queue.loop,
    };
  }

  public skip(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue || !queue.managedPlayer) {
      return;
    }
    queue.managedPlayer.player.stop();
  }

  public seek(guildId: string, seconds: number) {
    const queue = this.queue.get(guildId);
    if (!queue || !queue.managedPlayer) {
      return;
    }
    // check if seconds is valid
    const currentSong = queue.songs[queue.currentQueueIndex];
    if (!currentSong) {
      return;
    }
    if (seconds <= 0 || seconds > currentSong.duration) {
      return;
    }
    queue.seekTime = seconds;
    queue.managedPlayer.player.stop();
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
    queue.managedPlayer?.player.pause();
  }

  public resume(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.managedPlayer?.player.unpause();
  }

  public remove(guildId: string, index: number) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    if (index <= queue.currentQueueIndex) {
      return;
    }
    queue.songs.splice(index, 1);
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
      from >= queue.songs.length ||
      to >= queue.songs.length
    ) {
      return;
    }
    const [removed] = queue.songs.splice(from, 1);
    queue.songs.splice(to, 0, removed);
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
    queue.songs.splice(index, 1);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  public clearQueue(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    queue.songs.splice(queue.currentQueueIndex + 1);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  private async initPlayer(user: UserPayload, queue: ChannelQueue) {
    const channel = await this.channelSearchService.searchChannel(
      user.guildId,
      user.id,
    );
    if (!channel) {
      throw new HttpException(
        'You must be in a voice channel to use this command',
        400,
      );
    }
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
    queue.managedPlayer = {
      player,
      connection,
      channel,
    };
    return player;
  }

  private sendUpdate(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) return;
    if (queue.seekTime) return; // do not send update if the player is seeking
    if (
      queue.managedPlayer?.player.state.status === AudioPlayerStatus.Buffering
    )
      return;
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

  private async getResource(url: string, seek?: number) {
    if (seek) {
      const stream = await play.stream(url, {
        seek,
      });
      return createAudioResource(stream.stream, {
        inputType: stream.type,
      });
    }
    const stream = ytdl(url, PLAYER_OPTIONS);
    return createAudioResource(stream);
  }

  private async playResource(url: string, player: AudioPlayer, seek?: number) {
    const resource = await this.getResource(url, seek);
    player.play(resource);
  }

  private async playCurrentIndex(queue: ChannelQueue) {
    const nextSong = queue.songs[queue.currentQueueIndex] || queue.nextAutoPlay;
    const managedPlayer = queue.managedPlayer;
    if (!nextSong && managedPlayer) {
      managedPlayer.player.stop();
      managedPlayer.player.removeAllListeners();
      managedPlayer.connection.destroy();
      queue.managedPlayer = undefined;
      return;
    }
    if (!queue.managedPlayer) {
      throw new Error('No managed player');
    }
    await this.playResource(
      nextSong.url,
      // it's safe to assume that the player is defined since we just initialized it in the previous line
      queue.managedPlayer.player as AudioPlayer,
      queue.seekTime,
    );
    queue.startedAt = queue.seekTime || 0;
    queue.seekTime = undefined;
  }

  private playNext(guildId: string) {
    const queue = this.queue.get(guildId);
    if (!queue) {
      return;
    }
    if (!queue.seekTime && !queue.loop) {
      queue.currentQueueIndex++;
      if (queue.currentQueueIndex == queue.songs.length && queue.nextAutoPlay) {
        queue.songs.push(queue.nextAutoPlay);
      }
    }
    this.playCurrentIndex(queue);
    this.regenerateAutoPlay(guildId);
    this.sendUpdate(guildId);
  }

  private getPlaybackDuration(queue: ChannelQueue) {
    if (!queue.managedPlayer) {
      return 0;
    }
    if (queue.managedPlayer.player.state.status === AudioPlayerStatus.Idle) {
      return 0;
    }
    return (
      queue.managedPlayer.player.state.resource.playbackDuration +
      (queue.startedAt || 0) * 1000
    );
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
    const lastSong = queue.songs[queue.songs.length - 1];
    if (!lastSong) return;
    // avoid regenerating the next for the same song
    if (lastSong.videoId === queue.nextAutoPlay?.fromVideoId) return;
    const lastSongInfos = await ytdl.getInfo(lastSong.url, {
      lang: 'fr',
    });
    const nextAutoPlay = this.findBestRelatedSong(
      queue.songs,
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
}
