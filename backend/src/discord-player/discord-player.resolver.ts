import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GqlUser } from 'src/auth/decorators/gql-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { PUB_SUB } from 'src/pub-sub/pub-sub.module';
import { DiscordPlayerService } from './discord-player.service';
import { DiscordPlayer } from './models/discord-player.model';
import { DiscordPlayerSubscriptionPayload } from './types/discord-player-subscription-payload.type';

@Resolver(() => DiscordPlayer)
export class DiscordPlayerResolver {
  constructor(
    private readonly discordPlayerService: DiscordPlayerService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => DiscordPlayer)
  discordPlayer(@GqlUser() user: UserPayload): DiscordPlayer {
    return this.discordPlayerService.getDiscordPlayer(user.guildId);
  }

  @UseGuards(GqlAuthGuard)
  @Subscription(() => DiscordPlayer, {
    filter: (
      payload: DiscordPlayerSubscriptionPayload,
      _: unknown,
      context: { req: { user: UserPayload } },
    ) => {
      const { user } = context.req;
      return payload.guildId === user.guildId;
    },
    resolve: (payload: DiscordPlayerSubscriptionPayload) =>
      payload.discordPlayer,
  })
  discordPlayerSubscription() {
    return this.pubSub.asyncIterator(`discordPlayer`);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  skip(@GqlUser() user: UserPayload) {
    this.discordPlayerService.skip(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  pause(@GqlUser() user: UserPayload) {
    this.discordPlayerService.pause(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  resume(@GqlUser() user: UserPayload) {
    this.discordPlayerService.resume(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  back(@GqlUser() user: UserPayload) {
    this.discordPlayerService.back(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async seek(
    @GqlUser() user: UserPayload,
    @Args('seconds', { type: () => Int }) seconds: number,
  ) {
    this.discordPlayerService.seek(user.guildId, seconds);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async remove(
    @GqlUser() user: UserPayload,
    @Args('index', { type: () => Int }) index: number,
  ) {
    this.discordPlayerService.remove(user.guildId, index);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async move(
    @GqlUser() user: UserPayload,
    @Args('from', { type: () => Int }) from: number,
    @Args('to', { type: () => Int }) to: number,
  ) {
    this.discordPlayerService.move(user.guildId, from, to);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async playSong(
    @GqlUser() user: UserPayload,
    @Args('url', { type: () => String }) url: string,
  ) {
    await this.discordPlayerService.playSong(user, url);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async queueAddFront(
    @GqlUser() user: UserPayload,
    @Args('url', { type: () => String }) url: string,
  ) {
    await this.discordPlayerService.queueAddFront(user, url);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async queueAddBack(
    @GqlUser() user: UserPayload,
    @Args('url', { type: () => String }) url: string,
  ) {
    await this.discordPlayerService.queueAddBack(user, url);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeFromQueue(
    @GqlUser() user: UserPayload,
    @Args('index', { type: () => Int }) index: number,
  ) {
    await this.discordPlayerService.removeFromQueue(user.guildId, index);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async clearQueue(@GqlUser() user: UserPayload) {
    await this.discordPlayerService.clearQueue(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async toggleAutoPlay(@GqlUser() user: UserPayload) {
    await this.discordPlayerService.toggleAutoPlay(user.guildId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async toggleLoop(@GqlUser() user: UserPayload) {
    await this.discordPlayerService.toggleLoop(user.guildId);
    return true;
  }
}
