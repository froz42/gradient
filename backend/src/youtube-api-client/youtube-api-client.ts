import axios from 'axios';
import {
  GetChannel,
  GetChannelPlaylists,
  GetChannelVideos,
  GetVideosDuration,
  Thumbnail,
} from './types/requests.type';
import { Video } from 'src/search/model/video.model';
import { Playlist } from 'src/search/model/playlist.model';
import { ChannelPage } from 'src/channel/models/channel-page.model';
import getFormattedTime from 'src/utils/get-formated-time';

const API_URL = 'https://www.googleapis.com/youtube/v3';

type GetChannelVideosOptions = {
  maxResults: number;
  order: 'viewCount';
  regionCode?: string;
};

export class YoutubeApiClient {
  constructor(private readonly apiKey: string) {}

  private async getVideosDuration(videoIDs: string[]): Promise<number[]> {
    const result = await axios.get<GetVideosDuration>(`${API_URL}/videos`, {
      params: {
        key: this.apiKey,
        id: videoIDs.join(','),
        part: 'contentDetails',
      },
    });
    return result.data.items.map((item) => {
      const duration = item.contentDetails.duration;
      const hours = duration.match(/(\d+)H/);
      const minutes = duration.match(/(\d+)M/);
      const seconds = duration.match(/(\d+)S/);
      let totalSeconds = 0;
      if (hours) {
        totalSeconds += parseInt(hours[1]) * 60 * 60;
      }
      if (minutes) {
        totalSeconds += parseInt(minutes[1]) * 60;
      }
      if (seconds) {
        totalSeconds += parseInt(seconds[1]);
      }
      return totalSeconds;
    });
  }

  /**
   * The Youtube API returns some special characters as HTML entities.
   * such as &amp; for & or &quot; for "
   * @param str The string to convert
   */
  private convertStringWithSpecialEntities(str: string): string {
    const entities: { [key: string]: string } = {
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&lt;': '<',
      '&gt;': '>',
    };
    return str.replace(
      /(&amp;|&quot;|&#39;|&lt;|&gt;)/g,
      (match) => entities[match],
    );
  }

  private getThumbnailURL(thumbnails: {
    default?: Thumbnail;
    medium?: Thumbnail;
    high?: Thumbnail;
  }): string {
    if (thumbnails.high) {
      return thumbnails.high.url;
    } else if (thumbnails.medium) {
      return thumbnails.medium.url;
    } else if (thumbnails.default) {
      return thumbnails.default.url;
    } else {
      return '';
    }
  }

  private async getChannelVideos(
    channelID: string,
    options: GetChannelVideosOptions,
  ): Promise<Video[]> {
    const result = await axios.get<GetChannelVideos>(`${API_URL}/search`, {
      params: {
        key: this.apiKey,
        channelId: channelID,
        part: 'snippet,id',
        maxResults: options.maxResults,
        order: options.order,
        type: 'video',
        regionCode: options.regionCode || 'US',
      },
    });
    const videoIDs = result.data.items.map((item) => item.id.videoId);
    const durations = await this.getVideosDuration(videoIDs);
    return result.data.items.map((item, index) => ({
      id: item.id.videoId,
      title: this.convertStringWithSpecialEntities(item.snippet.title),
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      bestThumbnail: {
        url: this.getThumbnailURL(item.snippet.thumbnails),
        width: 0,
        height: 0,
      },
      author: {
        name: item.snippet.channelTitle,
        url: `https://www.youtube.com/channel/${item.snippet.channelId}`,
        channelID: item.snippet.channelId,
      },
      duration: getFormattedTime(durations[index] * 1000),
    }));
  }

  private async getChannelPlaylists(channelId: string): Promise<Playlist[]> {
    const result = await axios.get<GetChannelPlaylists>(
      `${API_URL}/playlists`,
      {
        params: {
          key: this.apiKey,
          channelId: channelId,
          part: 'snippet,id',
          maxResults: 10,
        },
      },
    );
    return result.data.items.map((item) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/playlist?list=${item.id}`,
      playlistID: item.id,
      firstVideo: {
        title: 'Does not matter',
        url: 'Does not matter',
        bestThumbnail: {
          url: this.getThumbnailURL(item.snippet.thumbnails),
          width: 0,
          height: 0,
        },
      },
      owner: {
        name: item.snippet.channelTitle,
        url: `https://www.youtube.com/channel/${item.snippet.channelId}`,
        channelID: item.snippet.channelId,
      },
    }));
  }

  public async getChannel(
    channelID: string,
    options: GetChannelVideosOptions,
  ): Promise<ChannelPage> {
    // get basic channel info
    const result = await axios.get<GetChannel>(`${API_URL}/channels`, {
      params: {
        key: this.apiKey,
        id: channelID,
        part: 'snippet,contentDetails,statistics,brandingSettings',
        regionCode: options.regionCode || 'US',
      },
    });
    const channel = result.data.items[0];
    // get channel videos
    const videosPromise = this.getChannelVideos(channelID, options);
    const playlistsPromise = this.getChannelPlaylists(channelID);
    this.getChannelPlaylists(channelID);
    return {
      name: this.convertStringWithSpecialEntities(channel.snippet.title),
      description: this.convertStringWithSpecialEntities(
        channel.snippet.description,
      ),
      id: channel.id,
      url: `https://www.youtube.com/channel/${channel.id}`,
      thumbnail: this.getThumbnailURL(channel.snippet.thumbnails),
      statistics: {
        viewCount: parseInt(channel.statistics.viewCount),
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
      },
      banner:
        channel.brandingSettings.image?.bannerExternalUrl +
        '=w1920-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj', // get the tv banner at 1920x1080
      videos: await videosPromise,
      playlists: await playlistsPromise,
    };
  }
}
