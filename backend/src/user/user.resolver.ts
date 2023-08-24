import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from 'src/auth/decorators/gql-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { User } from './models/user.model';

@Resolver(() => User)
export class UserResolver {
  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@GqlUser() user: UserPayload) {
    return user;
  }
}
