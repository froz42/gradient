import { AudioPlayerStatus } from '@discordjs/voice';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Song } from './song.model';

registerEnumType(AudioPlayerStatus, {
  name: 'AudioPlayerStatus',
});

@ObjectType()
export class DiscordPlayer {
  @Field(() => Int)
  currentQueueIndex: number;

  @Field(() => Int)
  playbackDuration: number;

  @Field(() => [Song])
  queue: Song[];

  @Field(() => AudioPlayerStatus)
  status: AudioPlayerStatus;

  @Field(() => Song, { nullable: true })
  nextAutoPlay?: Song | null;

  @Field(() => Boolean, { nullable: true })
  isLoopEnabled?: boolean;
}
