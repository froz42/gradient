import { Injectable } from '@nestjs/common';
import ytsr from 'ytsr';
import ytpl from 'ytpl';
import { Search } from './model/search.model';
import { Video } from './model/video.model';
import { Channel } from './model/channel.model';
import { Playlist } from './model/playlist.model';
import { Mix } from './model/mix.model';
import getFormattedTime from 'src/utils/get-formated-time';
import { video_info } from 'play-dl';
import throwExpression from 'src/utils/throw-expression';

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
    const videoID = params.get('v');
    const playlistID = params.get('list');
    return {
      videoID: videoID || undefined,
      playlistID: playlistID || undefined,
    };
  }

  public async fetchVideo(link: string): Promise<Video> {
    const info = await video_info(link);

    return {
      title: info.video_details.title || throwExpression('No video title'),
      url: info.video_details.url,
      id: info.video_details.id || throwExpression('No video id'),
      duration: getFormattedTime(info.video_details.durationInSec * 1000),
      durationSeconds: info.video_details.durationInSec,
      bestThumbnail: {
        url: info.video_details.thumbnails[0].url,
        width: info.video_details.thumbnails[0].width,
        height: info.video_details.thumbnails[0].height,
      },
      author: {
        name: info.video_details.channel?.name || throwExpression('No author'),
        url: info.video_details.channel?.url || throwExpression('No author'),
        channelID:
          info.video_details.channel?.id || throwExpression('No author'),
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
