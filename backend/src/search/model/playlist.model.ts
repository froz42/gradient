import { Field, ObjectType } from '@nestjs/graphql';
import { Owner } from './owner.model';
import { VideoSmall } from './video-small.model';

@ObjectType()
export class Playlist {
  @Field(() => String)
  title: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  playlistID: string;
  @Field(() => VideoSmall, { nullable: true })
  firstVideo?: VideoSmall | null;
  @Field(() => Owner, { nullable: true })
  owner: Owner | null;
}
