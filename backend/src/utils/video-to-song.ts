import { UserPayload } from 'src/auth/types/user-payload.type';
import { Song } from 'src/discord-player/models/song.model';
import { Video } from 'src/search/model/video.model';

export default function videoToSong(
  id: string,
  video: Video,
  requestedBy: UserPayload,
): Song {
  return {
    id,
    videoId: video.id,
    title: video.title,
    url: video.url,
    thumbnail: video.bestThumbnail.url ?? '',
    duration: video.durationSeconds ?? 0,
    authorUrl: video.author?.url ?? '',
    authorName: video.author?.name ?? '',
    authorId: video.author?.channelID ?? '',
    authorAvatar: video.author?.bestAvatar?.url ?? '',
    requestedBy,
  };
}
