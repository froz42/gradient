import { Injectable } from '@nestjs/common';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import { Search } from './model/search.model';
import { Video } from './model/video.model';
import { Channel } from './model/channel.model';
import { Playlist } from './model/playlist.model';
import { Mix } from './model/mix.model';
import getFormattedTime from 'src/utils/get-formated-time';

// https://youtu.be/WP2XAGZPh3w?list=RDWP2XAGZPh3w should be matched
const MATCH_VIDEO_LINK =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\?[\w=&]*)?$/;
@Injectable()
export class SearchService {
  private isVideoLink(link: string) {
    const match = link.match(MATCH_VIDEO_LINK);
    if (match && match[4]?.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Return the playlist ID if the link is a playlist link
   * @param link link to check
   * @returns playlist ID if the link is a playlist link, undefined otherwise
   */
  private getPlaylistId(link: string) {
    const match = link.match(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/,
    );
    if (match && match[4]?.length > 0) {
      return match[4];
    }
    return undefined;
  }

  public async fetchVideo(link: string): Promise<Search> {
    const videos: Video[] = [];
    const channels: Channel[] = [];
    const playlists: Playlist[] = [];
    const mixes: Mix[] = [];

    const info = await ytdl.getInfo(link);
    if (info.videoDetails.isLiveContent) {
      return {
        videos,
        channels,
        playlists,
        mixes,
      };
    }

    videos.push({
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
      id: info.videoDetails.videoId,
      duration: getFormattedTime(
        parseInt(info.videoDetails.lengthSeconds) * 1000,
      ),
      durationSeconds: parseInt(info.videoDetails.lengthSeconds),
      bestThumbnail: {
        url: info.videoDetails.thumbnails[0].url,
        width: info.videoDetails.thumbnails[0].width,
        height: info.videoDetails.thumbnails[0].height,
      },
      author: {
        name: info.videoDetails.author.name,
        url: info.videoDetails.author.channel_url,
        channelID: info.videoDetails.author.id,
      },
    });
    return {
      videos,
      channels,
      playlists,
      mixes,
    };
  }

  public async fetchPlaylist(id: string): Promise<Search> {
    const videos: Video[] = [];
    const channels: Channel[] = [];
    const playlists: Playlist[] = [];
    const mixes: Mix[] = [];

    const playlist = await ytpl(id, {
      hl: 'fr',
      gl: 'FR',
    });
    playlist.items.forEach((item) => {
      videos.push({
        title: item.title,
        url: item.url,
        id: item.id,
        bestThumbnail: {
          url: item.bestThumbnail.url,
          width: item.bestThumbnail.width,
          height: item.bestThumbnail.height,
        },
        author: {
          name: item.author.name,
          url: item.author.url,
          channelID: item.author.channelID,
        },
        duration: item.duration,
      });
    });
    playlists.push({
      title: playlist.title,
      url: playlist.url,
      playlistID: playlist.id,
      firstVideo: {
        title: playlist.items[0].title,
        url: playlist.items[0].url,
        bestThumbnail: {
          url: playlist.items[0].bestThumbnail.url,
          width: playlist.items[0].bestThumbnail.width,
          height: playlist.items[0].bestThumbnail.height,
        },
      },
      owner: {
        name: playlist.author.name,
        url: playlist.author.url,
        channelID: playlist.author.channelID,
      },
    });
    return {
      videos,
      channels,
      playlists,
      mixes,
    };
  }

  public async search(query: string): Promise<Search> {
    const playlistId = this.getPlaylistId(query);
    if (playlistId) {
      return this.fetchPlaylist(playlistId);
    }

    if (this.isVideoLink(query)) {
      return this.fetchVideo(query);
    }

    const result = await ytsr(query, {
      limit: 30,
      gl: 'FR',
      hl: 'fr',
    });
    const videos: Video[] = [];
    const channels: Channel[] = [];
    const playlists: Playlist[] = [];
    const mixes: Mix[] = [];

    result.items.forEach((item) => {
      switch (item.type) {
        case 'video':
          if (item.isLive) break;
          if (item.isUpcoming) break;
          videos.push(item);
          break;
        case 'channel':
          channels.push(item);
          break;
        case 'playlist':
          playlists.push(item);
          break;
        case 'mix':
          mixes.push(item);
          break;
      }
    });
    return {
      videos,
      channels,
      playlists,
      mixes,
    };
  }
}
