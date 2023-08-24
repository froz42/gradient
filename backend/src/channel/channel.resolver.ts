import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { ChannelPage } from './models/channel-page.model';

@Resolver(() => ChannelPage)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => ChannelPage)
  public async getChannel(
    @Args('channelID', { type: () => String }) channelID: string,
  ) {
    return this.channelService.getChannel(channelID);
  }
}
