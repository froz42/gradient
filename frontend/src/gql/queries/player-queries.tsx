import { gql } from "@apollo/client";

export const GET_PLAYER = gql`
  query discordPlayer {
    discordPlayer {
      currentQueueIndex
      playbackDuration
      queue {
        id
        videoId
        title
        url
        thumbnail
        duration
        authorUrl
        authorId
        authorName
        authorAvatar
        requestedBy {
          id
          displayName
          avatar
        }
      }
      status
      nextAutoPlay {
        id
        videoId
        title
        url
        thumbnail
        duration
        authorUrl
        authorId
        authorName
        authorAvatar
      }
      isLoopEnabled
    }
  }
`;

export const ON_PLAYER_UPDATE = gql`
  subscription OnPlayerUpdate {
    discordPlayerSubscription {
      currentQueueIndex
      playbackDuration
      queue {
        id
        videoId
        title
        url
        thumbnail
        duration
        authorUrl
        authorId
        authorName
        authorAvatar
        requestedBy {
          id
          displayName
          avatar
        }
      }
      status
      nextAutoPlay {
        id
        videoId
        title
        url
        thumbnail
        duration
        authorUrl
        authorId
        authorName
        authorAvatar
      }
      isLoopEnabled
    }
  }
`;

export const PAUSE_PLAYER = gql`
  mutation pausePlayer {
    pause
  }
`;

export const RESUME_PLAYER = gql`
  mutation resumePlayer {
    resume
  }
`;

export const SKIP_SONG = gql`
  mutation skipSong {
    skip
  }
`;

export const BACK_SONG = gql`
  mutation backSong {
    back
  }
`;

export const SEEK_PLAYER = gql`
  mutation SeekPlayer($seconds: Int!) {
    seek(seconds: $seconds)
  }
`;

export const MOVE_QUEUE = gql`
  mutation MoveQueue($from: Int!, $to: Int!) {
    move(from: $from, to: $to)
  }
`;

export const PLAY_SONG = gql`
  mutation PlaySong($url: String!) {
    playSong(url: $url)
  }
`;

export const QUEUE_ADD_FRONT = gql`
  mutation QueueAddFront($url: String!) {
    queueAddFront(url: $url)
  }
`;

export const QUEUE_ADD_BACK = gql`
  mutation QueueAddBack($url: String!) {
    queueAddBack(url: $url)
  }
`;

export const QUEUE_REMOVE = gql`
  mutation RemoveFromQueue($index: Int!) {
    removeFromQueue(index: $index)
  }
`;

export const PLAY_PLAYLIST = gql`
  mutation PlayPlaylist(
    $playlistID: String!
    $index: Int!
    $clearQueue: Boolean!
  ) {
    playPlaylist(
      playlistID: $playlistID
      index: $index
      clearQueue: $clearQueue
    )
  }
`;

export const CLEAR_QUEUE = gql`
  mutation ClearQueue {
    clearQueue
  }
`;

export const TOGGLE_AUTOPLAY = gql`
  mutation ToggleAutoPlay {
    toggleAutoPlay
  }
`;

export const TOGGLE_LOOP = gql`
  mutation ToggleLoop {
    toggleLoop
  }
`;
