import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from './image.model';

@ObjectType()
export class Channel {
  @Field(() => String)
  name: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  channelID: string;
  @Field(() => Image, { nullable: true })
  bestAvatar: Image;
  @Field(() => Boolean)
  verified: boolean;
}
