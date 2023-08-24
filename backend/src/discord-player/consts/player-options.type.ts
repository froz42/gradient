import ytdl from 'ytdl-core';

export const PLAYER_OPTIONS: ytdl.downloadOptions = {
  filter: 'audioonly',
  quality: 'lowestaudio',
  highWaterMark: 1 << 62,
  liveBuffer: 1 << 62,
  dlChunkSize: 0,
};
