import { Field, ObjectType } from '@nestjs/graphql';
import { VideoSmall } from './video-small.model';

@ObjectType()
export class Mix {
  @Field(() => String)
  title: string;
  @Field(() => String)
  url: string;
  @Field(() => VideoSmall)
  firstVideo: VideoSmall;
}
