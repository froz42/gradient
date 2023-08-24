import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';
import { DiscordPlayerService } from './discord-player.service';

@Injectable()
export class DiscordPlayerEvents {
  constructor(private readonly discordPlayerService: DiscordPlayerService) {}

  @On('voiceChannelLeave')
  onVoiceChannelLeave(@Context() [, channel]: ContextOf<'voiceChannelLeave'>) {
    Logger.log(`User left voice channel ${channel.id}`, this.constructor.name);
    this.discordPlayerService.handleVoiceChannelLeave(channel);
  }
}
