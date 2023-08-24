import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { Song } from '../models/song.model';

export type ChannelQueue = {
  songIdIndex: number;
  songs: Song[];
  currentQueueIndex: number;
  seekTime?: number;
  startedAt?: number;
  nextAutoPlay?: Song & {
    fromVideoId: string;
  };
  loop?: boolean;
  managedPlayer?: {
    player: AudioPlayer;
    connection: VoiceConnection;
    channel: VoiceBasedChannel;
  };
};
