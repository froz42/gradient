import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Image } from './image.model';
import { VideoAuthor } from './video-author.model';

@ObjectType()
export class Video {
  @Field(() => String)
  title: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  id: string;
  @Field(() => Image)
  bestThumbnail: Image;
  @Field(() => VideoAuthor, { nullable: true })
  author?: VideoAuthor | null;
  @Field(() => String, { nullable: true })
  duration?: string | null;
  @Field(() => Int, { nullable: true })
  durationSeconds?: number;
}
