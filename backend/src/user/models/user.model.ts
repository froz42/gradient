import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  guildId: string;

  @Field(() => String)
  guildName: string;

  @Field(() => String)
  guildIcon: string;
}
