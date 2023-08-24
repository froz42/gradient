import { RequestedBy } from 'src/discord-player/models/requested-by.model';
import { Song } from 'src/discord-player/models/song.model';
import ytdl from 'ytdl-core';

export default function videoInfoToSong(
  id: string,
  videoInfo: ytdl.videoInfo,
  requestedBy: RequestedBy,
): Song {
  return {
    id,
    videoId: videoInfo.videoDetails.videoId,
    title: videoInfo.videoDetails.title,
    url: videoInfo.videoDetails.video_url,
    thumbnail: videoInfo.videoDetails.thumbnails[0].url,
    duration: parseInt(videoInfo.videoDetails.lengthSeconds),
    authorUrl: videoInfo.videoDetails.author.channel_url,
    authorName: videoInfo.videoDetails.author.name,
    authorId: videoInfo.videoDetails.author.id,
    authorAvatar: videoInfo.videoDetails.author.thumbnails?.[0].url ?? '',
    requestedBy,
  };
}
