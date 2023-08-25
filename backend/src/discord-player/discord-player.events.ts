import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';
import { DiscordPlayerService } from './discord-player.service';

@Injectable()
export class DiscordPlayerEvents {
  constructor(private readonly discordPlayerService: DiscordPlayerService) {}

  @On('voiceChannelLeave')
  onVoiceChannelLeave(
    @Context() [user, channel]: ContextOf<'voiceChannelLeave'>,
  ) {
    if (user.user.bot) return;
    Logger.log(`User left voice channel ${channel.id}`, this.constructor.name);
    this.discordPlayerService.handleVoiceChannelLeave(channel);
  }
}
