import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { DiscordPlayerCommand } from './discord-player.command';
import { DiscordPlayerResolver } from './discord-player.resolver';
import { DiscordPlayerService } from './discord-player.service';
import { ChannelSearchModule } from 'src/channel-search/channel-search.module';
import { DiscordPlayerEvents } from './discord-player.events';

@Module({
  imports: [PubSubModule, ChannelSearchModule],
  providers: [
    DiscordPlayerService,
    DiscordPlayerCommand,
    DiscordPlayerResolver,
    DiscordPlayerEvents,
  ],
  exports: [DiscordPlayerService],
})
export class DiscordPlayerModule {}
