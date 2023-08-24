import { gql } from "@apollo/client";

const GET_PLAYLIST_QUERY = gql`
  query GetPlaylist($playlistID: String!) {
    getPlaylist(playlistID: $playlistID) {
      title
      bestThumbnail {
        url
      }
      lastUpdated
      description
      author {
        name
        channelID
      }
      videos {
        id
        title
        url
        bestThumbnail {
          url
        }
        author {
          name
          channelID
        }
        duration
      }
    }
  }
`;

export default GET_PLAYLIST_QUERY;