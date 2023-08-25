import { Injectable } from '@nestjs/common';
import throwExpression from 'src/utils/throw-expression';
import { YoutubeApiClient } from 'src/youtube-api-client/youtube-api-client';

@Injectable()
export class ChannelService {
  private readonly youtubeApiClient: YoutubeApiClient;

  constructor() {
    this.youtubeApiClient = new YoutubeApiClient(
      process.env.YOUTUBE_API_KEY ??
        throwExpression('YOUTUBE_API_KEY is not defined'),
    );
  }

  public async getChannel(channelID: string) {
    return this.youtubeApiClient.getChannel(channelID, {
      maxResults: 20,
      order: 'viewCount',
      regionCode: 'FR',
    });
  }
}
