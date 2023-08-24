import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from './image.model';

@ObjectType()
export class VideoSmall {
  @Field(() => String)
  url: string;
  @Field(() => String)
  title: string;
  @Field(() => Image)
  bestThumbnail: Image;
}
