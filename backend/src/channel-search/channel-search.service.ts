import { Injectable } from '@nestjs/common';
import { ChannelType, Client, VoiceBasedChannel } from 'discord.js';

@Injectable()
export class ChannelSearchService {
  constructor(private readonly client: Client) {}

  /**
   * Search for a channel in a guild
   * @param guildId the guild id to search in
   * @param userId the user id to search for
   */
  async searchChannel(
    guildId: string,
    userId: string,
  ): Promise<VoiceBasedChannel | null> {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild) {
      return null;
    }

    const channels = await guild.channels.fetch();

    const channel = channels.find((channel) => {
      if (!channel) return false;
      if (channel.type !== ChannelType.GuildVoice) return false;
      const voiceChannel = channel as VoiceBasedChannel;
      const member = voiceChannel.members.find(
        (member) => member.id === userId,
      );
      if (!member) return false;
      return true;
    });
    return (channel as VoiceBasedChannel) || null;
  }

  async isUserInVoiceChannel(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild) {
      return false;
    }

    const channels = await guild.channels.fetch();

    const channel = channels.find((channel) => {
      if (!channel) return false;
      if (channel.type !== ChannelType.GuildVoice) return false;
      const voiceChannel = channel as VoiceBasedChannel;
      if (voiceChannel.members.filter((member) => !member.user.bot).size !== 0)
        return true;
    });
    return !!channel;
  }
}
