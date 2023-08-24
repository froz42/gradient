import { DiscordPlayer } from '../models/discord-player.model';

export type DiscordPlayerSubscriptionPayload = {
  discordPlayer: DiscordPlayer;
  guildId: string;
};
