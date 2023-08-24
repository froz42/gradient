import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Owner {
  @Field(() => String)
  name: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  channelID: string;
}
