import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GatewayIntentBits } from 'discord.js';
import { NecordModule } from 'necord';
import { DiscordPlayerModule } from './discord-player/discord-player.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { AuthModule } from './auth/auth.module';
import throwExpression from './utils/throw-expression';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { ChannelSearchModule } from './channel-search/channel-search.module';
import { ChannelModule } from './channel/channel.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: (context: any) => {
        if (context?.extra?.request) {
          return {
            req: {
              ...context?.extra?.request,
              headers: {
                ...context?.extra?.request?.headers,
                ...context?.connectionParams,
              },
            },
          };
        }
        return context;
      },
    }),
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token:
        process.env.DISCORD_TOKEN ??
        throwExpression('DISCORD_TOKEN is not defined'),
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? throwExpression('JWT_SECRET not set'),
      signOptions: { expiresIn: '365d' },
    }),
    DiscordPlayerModule,
    PubSubModule,
    AuthModule,
    UserModule,
    SearchModule,
    ChannelSearchModule,
    ChannelModule,
    PlaylistModule,
  ],
})
export class AppModule {}
