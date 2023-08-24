import { gql } from "@apollo/client";

const GET_CHANNEL_QUERY = gql`
  query getChannel($channelID: String!) {
    getChannel(channelID: $channelID) {
      name
      description
      url
      id
      thumbnail
      statistics {
        viewCount
        subscriberCount
        videoCount
      }
      banner
      videos {
        id
        title
        url
        bestThumbnail {
          url
        }
        duration
        author {
          name
          url
          channelID
        }
      }
      playlists {
        playlistID
        title
        url
        firstVideo {
          bestThumbnail {
            url
          }
        }
        owner {
          channelID
          url
          name
        }
      }
    }
  }
`;

export default GET_CHANNEL_QUERY;
