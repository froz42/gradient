import { Module } from '@nestjs/common';
import { ChannelSearchService } from './channel-search.service';

@Module({
  providers: [ChannelSearchService],
  exports: [ChannelSearchService],
})
export class ChannelSearchModule {}
