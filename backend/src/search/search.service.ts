import { Injectable } from '@nestjs/common';
import ytsr from 'ytsr';
import ytpl from 'ytpl';
import { Search } from './model/search.model';
import { Video } from './model/video.model';
import { Channel } from './model/channel.model';
import { Playlist } from './model/playlist.model';
import { Mix } from './model/mix.model';
import getFormattedTime from 'src/utils/get-formated-time';
import throwExpression from 'src/utils/throw-expression';
import ytdl from 'ytdl-core';

type LinkData = {
  videoID?: string;
  playlistID?: string;
};

const VIDEO_ID_REGEX = /^[a-zA-Z0-9-_]{11}$/;
const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

@Injectable()
export class SearchService {
  private isVideoLink(url: string): LinkData | undefined {
    if (!YOUTUBE_URL_REGEX.test(url)) {
      return;
    }
    const location = new URL(url);
    const params = new URLSearchParams(location.search);

    // If the url is a video link
    if (VIDEO_ID_REGEX.test(location.pathname.slice(1))) {
      return {
        videoID: location.pathname.slice(1),
        playlistID: params.get('list') || undefined,
      };
    }
    // if url is a short
    const [type, shortId] = location.pathname.slice(1).split('/');
    if (type === 'shorts') {
      return {
        videoID: shortId,
        playlistID: undefined,
      };
    }
    const videoID = params.get('v');
    const playlistID = params.get('list');
    return {
      videoID: videoID || undefined,
      playlistID: playlistID || undefined,
    };
  }

  public async fetchVideo(link: string): Promise<Video> {
    const info = await ytdl.getInfo(link);

    return {
      title: info.videoDetails.title || throwExpression('No video title'),
      url: info.videoDetails.video_url,
      id: info.videoDetails.videoId || throwExpression('No video id'),
      duration: getFormattedTime(
        Number(info.videoDetails.lengthSeconds) * 1000,
      ),
      durationSeconds: Number(info.videoDetails.lengthSeconds),
      bestThumbnail: {
        url: info.videoDetails.thumbnails[0].url,
        width: info.videoDetails.thumbnails[0].width,
        height: info.videoDetails.thumbnails[0].height,
      },
      author: {
        name: info.videoDetails.author.name || throwExpression('No author'),
        url: info.videoDetails.author.channel_url,
        channelID:
          info.videoDetails.author.id || throwExpression('No channel id'),
      },
    };
  }

  public async fetchPlaylist(id: string): Promise<Playlist> {
    const playlist = await ytpl(id, {
      hl: 'fr',
      gl: 'FR',
    });
    return {
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
    };
  }

  public async search(query: string): Promise<Search> {
    const videos: Video[] = [];
    const channels: Channel[] = [];
    const playlists: Playlist[] = [];
    const mixes: Mix[] = [];

    const linkData = this.isVideoLink(query);
    if (linkData) {
      if (linkData.videoID) {
        try {
          videos.push(await this.fetchVideo(linkData.videoID));
        } catch {}
      }
      if (linkData.playlistID) {
        try {
          playlists.push(await this.fetchPlaylist(linkData.playlistID));
        } catch {}
      }
      return {
        videos,
        channels,
        playlists,
        mixes,
      };
    }

    const result = await ytsr(query, {
      limit: 30,
      gl: 'FR',
      hl: 'fr',
    });

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
