/* eslint-disable react-refresh/only-export-components */
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DiscordPlayer, Song } from "../gql/graphql";
import {
  BACK_SONG,
  GET_PLAYER,
  MOVE_QUEUE,
  ON_PLAYER_UPDATE,
  PAUSE_PLAYER,
  PLAY_SONG,
  QUEUE_ADD_BACK,
  QUEUE_ADD_FRONT,
  RESUME_PLAYER,
  SEEK_PLAYER,
  SKIP_SONG,
  QUEUE_REMOVE,
  PLAY_PLAYLIST,
  CLEAR_QUEUE,
  TOGGLE_AUTOPLAY,
  TOGGLE_LOOP,
} from "../gql/queries/player-queries";

export interface Player {
  player?: DiscordPlayer;
  getCurrentSong: () => Song | undefined;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  back: () => void;
  seek: (timeSecond: number) => void;
  move: (from: number, to: number) => void;
  play: (url: string) => void;
  queueAddFront: (url: string) => void;
  queueAddBack: (url: string) => void;
  queueRemove: (index: number) => void;
  playPlaylist: (
    playlistID: string,
    index: number,
    clearQueue: boolean
  ) => void;
  clearQueue: () => void;
  toggleAutoplay: () => void;
  toggleLoop: () => void;
}

const PlayerContext = createContext<Player | undefined>(undefined);

const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

const PlayerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [player, setPlayer] = useState<DiscordPlayer | undefined>(undefined);
  const { data } = useQuery<{ discordPlayer: DiscordPlayer }>(GET_PLAYER);

  const { data: playerUpdate } = useSubscription<{
    discordPlayerSubscription: DiscordPlayer;
  }>(ON_PLAYER_UPDATE);

  useEffect(() => {
    if (data) {
      setPlayer(data.discordPlayer);
    }
  }, [data]);

  useEffect(() => {
    if (playerUpdate) {
      setPlayer(playerUpdate.discordPlayerSubscription);
    }
  }, [playerUpdate]);

  const getCurrentSong = useCallback(() => {
    if (player && player.currentQueueIndex < player.queue.length) {
      return player.queue[player.currentQueueIndex];
    }
    return undefined;
  }, [player]);

  const [pause] = useMutation(PAUSE_PLAYER);
  const [resume] = useMutation(RESUME_PLAYER);
  const [skip] = useMutation(SKIP_SONG);
  const [back] = useMutation(BACK_SONG);
  const [seekMutation] = useMutation(SEEK_PLAYER);
  const [moveMutation] = useMutation(MOVE_QUEUE);
  const [playMutation] = useMutation(PLAY_SONG);
  const [queueAddFrontMutation] = useMutation(QUEUE_ADD_FRONT);
  const [queueAddBackMutation] = useMutation(QUEUE_ADD_BACK);
  const [queueRemoveMutation] = useMutation(QUEUE_REMOVE);
  const [playPlaylistMutation] = useMutation(PLAY_PLAYLIST);
  const [clearQueue] = useMutation(CLEAR_QUEUE);
  const [toggleAutoplay] = useMutation(TOGGLE_AUTOPLAY);
  const [toggleLoop] = useMutation(TOGGLE_LOOP);

  const seek = useCallback(
    (timeSecond: number) => {
      seekMutation({
        variables: {
          seconds: timeSecond,
        },
      });
    },
    [seekMutation]
  );
  const move = useCallback(
    (from: number, to: number) => {
      moveMutation({
        variables: {
          from,
          to,
        },
      });
    },
    [moveMutation]
  );
  const play = useCallback(
    (url: string) => {
      playMutation({
        variables: {
          url,
        },
      });
    },
    [playMutation]
  );
  const queueAddFront = useCallback(
    (url: string) => {
      queueAddFrontMutation({
        variables: {
          url,
        },
      });
    },
    [queueAddFrontMutation]
  );

  const queueAddBack = useCallback(
    (url: string) => {
      queueAddBackMutation({
        variables: {
          url,
        },
      });
    },
    [queueAddBackMutation]
  );
  const queueRemove = useCallback(
    (index: number) => {
      queueRemoveMutation({
        variables: {
          index,
        },
      });
    },
    [queueRemoveMutation]
  );
  const playPlaylist = useCallback(
    (playlistID: string, index: number, clearQueue: boolean) => {
      playPlaylistMutation({
        variables: {
          playlistID,
          index,
          clearQueue,
        },
      });
    },
    [playPlaylistMutation]
  );

  return (
    <PlayerContext.Provider
      value={{
        player,
        getCurrentSong,
        pause,
        resume,
        skip,
        back,
        seek,
        move,
        play,
        queueAddFront,
        queueAddBack,
        queueRemove,
        playPlaylist,
        clearQueue,
        toggleAutoplay,
        toggleLoop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, usePlayer };
