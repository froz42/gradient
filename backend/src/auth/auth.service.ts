import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuildMember } from 'discord.js';
import { UserPayload } from './types/user-payload.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public signIn(user: GuildMember): { token: string } {
    const jwtPayload: UserPayload = {
      guildId: user.guild.id,
      guildName: user.guild.name,
      id: user.id,
      displayName: user.displayName,
      avatar: user.user.avatar || '',
      guildIcon: user.guild.icon || '',
    };
    return {
      token: this.jwtService.sign(jwtPayload, { expiresIn: '365d' }),
    };
  }

  public getAuthUrl(user: GuildMember) {
    const { token } = this.signIn(user);
    return `${process.env.FRONTEND_URL}/auth?token=${token}`;
  }
}
