export type GetVideosDurationItem = {
  id: string;
  kind: string;
  etag: string;
  contentDetails: {
    duration: string;
  };
};

export type GetVideosDuration = {
  kind: string;
  etag: string;
  items: GetVideosDurationItem[];
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type GetChannelVideosItem = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
    };
    channelTitle: string;
    liveBroadcastContent: 'none';
    publishTime: string;
  };
};

export type GetChannelVideos = {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: GetChannelVideosItem[];
};

export type GetChannelPlaylistsItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
    };
    channelTitle: string;
    publishTime: string;
  };
};

export type GetChannelPlaylists = {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: GetChannelPlaylistsItem[];
};

export type GetChannelItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
    localized: {
      title: string;
      description: string;
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings: {
    channel: {
      title: string;
      description: string;
    };
    image: {
      bannerExternalUrl: string;
    };
  };
};

export type GetChannel = {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: GetChannelItem[];
};
