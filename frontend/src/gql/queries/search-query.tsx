import { gql } from "@apollo/client";

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      videos {
        title
        url
        bestThumbnail {
          url
        }
        duration
        author {
          channelID
          name
          url
        }
      }
      channels {
        name
        url
        channelID
        bestAvatar {
          url
        }
        verified
      }
      mixes {
        title
        url
        firstVideo {
          bestThumbnail {
            url
          }
        }
      }
      playlists {
        title
        url
        playlistID
        firstVideo {
          bestThumbnail {
            url
          }
        }
        owner {
          url
          name
          channelID
        }
      }
    }
  }
`;

export default SEARCH_QUERY;
