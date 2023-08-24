import { Injectable } from '@nestjs/common';
import { YoutubeApiClient } from 'src/youtube-api-client/youtube-api-client';

const apiKey = 'AIzaSyBaMlad4Q1lswBOFhirKd1LBA-KcSIcT6A';

@Injectable()
export class ChannelService {
  private readonly youtubeApiClient: YoutubeApiClient;

  constructor() {
    this.youtubeApiClient = new YoutubeApiClient(apiKey);
  }

  public async getChannel(channelID: string) {
    return this.youtubeApiClient.getChannel(channelID, {
      maxResults: 20,
      order: 'viewCount',
      regionCode: 'FR',
    });
  }
}
