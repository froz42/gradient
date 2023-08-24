import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RequestedBy } from './requested-by.model';

@ObjectType()
export class Song {
  @Field(() => String)
  id: string;

  @Field(() => String)
  videoId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  thumbnail: string;

  @Field(() => Int)
  duration: number;

  @Field(() => String)
  authorUrl: string;

  @Field(() => String)
  authorName: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  authorAvatar: string;

  @Field(() => RequestedBy)
  requestedBy: RequestedBy;
}
