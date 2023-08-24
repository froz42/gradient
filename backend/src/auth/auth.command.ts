import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { AuthService } from './auth.service';

@Injectable()
export class AuthCommand {
  constructor(private readonly authService: AuthService) {}

  @SlashCommand({
    name: 'dashboard',
    description: 'Get the link to the dashboard',
  })
  async dashboard(@Context() [interaction]: SlashCommandContext) {
    if (!interaction.guild) {
      return interaction.reply({
        content: 'You must be in a guild to use this command',
        ephemeral: true,
      });
    }

    const member: GuildMember = interaction.member as GuildMember;

    if (!member.voice?.channel) {
      return interaction.reply({
        content: 'You must be in a voice channel to use this command',
        ephemeral: true,
      });
    }

    const url = this.authService.getAuthUrl(member);

    const embed = new EmbedBuilder().setTitle('Dashboard');
    embed.setDescription(`Click the bellow button to access the dashboard`);
    const button = new ButtonBuilder()
      .setLabel('Dashboard')
      .setStyle(ButtonStyle.Link)
      .setURL(url);

    return interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
      ephemeral: true,
    });
  }
}
