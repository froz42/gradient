import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { DiscordPlayerCommand } from './discord-player.command';
import { DiscordPlayerResolver } from './discord-player.resolver';
import { DiscordPlayerService } from './discord-player.service';
import { ChannelSearchModule } from 'src/channel-search/channel-search.module';

@Module({
  imports: [PubSubModule, ChannelSearchModule],
  providers: [
    DiscordPlayerService,
    DiscordPlayerCommand,
    DiscordPlayerResolver,
  ],
  exports: [DiscordPlayerService],
})
export class DiscordPlayerModule {}
