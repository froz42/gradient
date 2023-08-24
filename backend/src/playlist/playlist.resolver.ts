import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlaylistService } from './playlist.service';
import { PlaylistPage } from './models/playlist-page.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { GqlUser } from 'src/auth/decorators/gql-user.decorator';
import { UserPayload } from 'src/auth/types/user-payload.type';

@Resolver()
export class PlaylistResolver {
  constructor(private readonly playlistService: PlaylistService) {}

  @Query(() => PlaylistPage)
  async getPlaylist(@Args('playlistID') playlistID: string) {
    return this.playlistService.getPlaylist(playlistID);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async playPlaylist(
    @GqlUser() user: UserPayload,
    @Args('playlistID') playlistID: string,
    @Args('index', {
      type: () => Int,
    })
    index: number,
    @Args('clearQueue', {
      type: () => Boolean,
    })
    clearQueue: boolean,
  ) {
    return this.playlistService.playPlaylist(
      user,
      playlistID,
      index,
      clearQueue,
    );
  }
}
