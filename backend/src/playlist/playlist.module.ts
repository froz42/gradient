import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { DiscordPlayerModule } from 'src/discord-player/discord-player.module';

@Module({
  providers: [PlaylistService, PlaylistResolver],
  imports: [DiscordPlayerModule],
})
export class PlaylistModule {}
