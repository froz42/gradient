import { Injectable } from '@nestjs/common';
import { GuildMember, InteractionResponse } from 'discord.js';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { DiscordPlayerService } from './discord-player.service';
import { PlayDto } from './types/play.dto';
import { UserPayload } from 'src/auth/types/user-payload.type';

@Injectable()
export class DiscordPlayerCommand {
  constructor(private readonly discordPlayerService: DiscordPlayerService) {}

  @SlashCommand({
    name: 'play',
    description: 'Play a song',
  })
  async play(
    @Context() [interaction]: SlashCommandContext,
    @Options() { url }: PlayDto,
  ): Promise<InteractionResponse<boolean>> {
    // check if user is in a guild
    if (!interaction.guild) {
      return interaction.reply({
        content: 'You must be in a guild to use this command',
        ephemeral: true,
      });
    }
    // check if user is in a voice channel
    const member: GuildMember = interaction.member as GuildMember;
    if (!member.voice?.channel) {
      return interaction.reply({
        content: 'You must be in a voice channel to use this command',
        ephemeral: true,
      });
    }
    const userPayload: UserPayload = {
      id: member.id,
      displayName: member.displayName,
      avatar: member.user.avatar || '',
      guildId: interaction.guild.id,
      guildName: interaction.guild.name,
      guildIcon: interaction.guild.icon || '',
    };
    await this.discordPlayerService.queueAddBack(userPayload, url);
    return interaction.reply({
      content: 'Added to queue (ghetto)',
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: 'skip',
    description: 'Skip the current song',
  })
  async skip(@Context() [interaction]: SlashCommandContext) {
    if (!interaction.guild) {
      return interaction.reply({
        content: 'You must be in a guild to use this command',
        ephemeral: true,
      });
    }
    this.discordPlayerService.skip(interaction.guild.id);
    return interaction.reply({
      content: 'Skipped',
      ephemeral: true,
    });
  }
}
