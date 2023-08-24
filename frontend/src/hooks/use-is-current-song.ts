import { useMemo } from "react";
import { usePlayer } from "../providers/player.provider";
import { AudioPlayerStatus } from "../gql/graphql";

export default function useIsCurrentSong(songId: string) {
  const { player } = usePlayer();
  return useMemo(() => {
    if (!player) return [false, false];
    const isCurrentSong =
      player.queue[player.currentQueueIndex]?.videoId === songId;
    const isCurrentSongPlaying =
      isCurrentSong && player.status === AudioPlayerStatus.Playing;
    return [isCurrentSong, isCurrentSongPlaying];
  }, [player, songId]);
}
