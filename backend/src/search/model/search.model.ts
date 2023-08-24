import { Field, ObjectType } from '@nestjs/graphql';
import { Channel } from './channel.model';
import { Mix } from './mix.model';
import { Playlist } from './playlist.model';
import { Video } from './video.model';

@ObjectType()
export class Search {
  @Field(() => [Video])
  videos: Video[];
  @Field(() => [Channel])
  channels: Channel[];
  @Field(() => [Mix])
  mixes: Mix[];
  @Field(() => [Playlist])
  playlists: Playlist[];
}
