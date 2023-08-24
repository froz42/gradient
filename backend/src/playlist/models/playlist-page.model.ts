import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/search/model/image.model';
import { Owner } from 'src/search/model/owner.model';
import { Video } from 'src/search/model/video.model';

@ObjectType()
export class PlaylistPage {
  @Field(() => String)
  title: string;
  @Field(() => Image)
  bestThumbnail: Image;
  @Field(() => String)
  lastUpdated: string;
  @Field(() => String, { nullable: true })
  description: string | null;
  @Field(() => Owner)
  author: Owner;
  @Field(() => [Video])
  videos: Video[];
}
