import { Field, ObjectType } from '@nestjs/graphql';
import { Playlist } from 'src/search/model/playlist.model';
import { Video } from 'src/search/model/video.model';
@ObjectType()
export class Statistics {
  @Field(() => Number)
  viewCount: number;
  @Field(() => Number)
  subscriberCount: number;
  @Field(() => Number)
  videoCount: number;
}

@ObjectType()
export class ChannelPage {
  @Field(() => String)
  name: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  id: string;
  @Field(() => String)
  thumbnail: string;
  @Field(() => Statistics)
  statistics: Statistics;
  @Field(() => String)
  banner: string;
  @Field(() => [Video])
  videos: Video[];
  @Field(() => [Playlist])
  playlists: Playlist[];
}
