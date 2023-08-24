import { Injectable } from '@nestjs/common';
import { Image } from 'src/search/model/image.model';
import { Video } from 'src/search/model/video.model';
import ytpl from 'ytpl';
import { PlaylistPage } from './models/playlist-page.model';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { DiscordPlayerService } from 'src/discord-player/discord-player.service';
@Injectable()
export class PlaylistService {
  constructor(private readonly discordPlayerService: DiscordPlayerService) {}

  private addItemsToVideoList(videoList: Video[], items: ytpl.Item[]): Video[] {
    items.forEach((item) => {
      const bestThumbnail: Image = {
        url: item.bestThumbnail.url ?? '',
        width: item.bestThumbnail.width ?? 0,
        height: item.bestThumbnail.height ?? 0,
      };
      videoList.push({
        title: item.title,
        id: item.id,
        url: item.url,
        bestThumbnail,
        author: item.author,
        duration: item.duration || '',
        durationSeconds: item.durationSec || undefined,
      });
    });
    return videoList;
  }

  public async getPlaylist(playlistID: string): Promise<PlaylistPage> {
    const playlist = await ytpl(playlistID, {
      gl: 'FR',
      hl: 'fr',
    });
    const videos: Video[] = [];
    this.addItemsToVideoList(videos, playlist.items);
    let continuation = playlist.continuation;
    while (continuation) {
      const nextVideos = await ytpl.continueReq(continuation);
      this.addItemsToVideoList(videos, nextVideos.items);
      continuation = nextVideos.continuation;
    }
    const bestThumbnail: Image = {
      url: playlist.bestThumbnail.url ?? '',
      width: playlist.bestThumbnail.width ?? 0,
      height: playlist.bestThumbnail.height ?? 0,
    };
    return {
      title: playlist.title,
      bestThumbnail,
      lastUpdated: playlist.lastUpdated,
      description: playlist.description,
      author: playlist.author,
      videos,
    };
  }

  public async playPlaylist(
    user: UserPayload,
    playlistID: string,
    index: number,
    clearQueue: boolean,
  ) {
    const playlist = await this.getPlaylist(playlistID);
    await this.discordPlayerService.playPlaylist(
      user,
      playlist,
      index,
      clearQueue,
    );
    return true;
  }
}
