/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum AudioPlayerStatus {
  AutoPaused = 'AutoPaused',
  Buffering = 'Buffering',
  Idle = 'Idle',
  Paused = 'Paused',
  Playing = 'Playing'
}

export type Channel = {
  __typename?: 'Channel';
  bestAvatar?: Maybe<Image>;
  channelID: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type ChannelPage = {
  __typename?: 'ChannelPage';
  banner: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  playlists: Array<Playlist>;
  statistics: Statistics;
  thumbnail: Scalars['String']['output'];
  url: Scalars['String']['output'];
  videos: Array<Video>;
};

export type DiscordPlayer = {
  __typename?: 'DiscordPlayer';
  currentQueueIndex: Scalars['Int']['output'];
  isLoopEnabled?: Maybe<Scalars['Boolean']['output']>;
  nextAutoPlay?: Maybe<Song>;
  playbackDuration: Scalars['Int']['output'];
  queue: Array<Song>;
  status: AudioPlayerStatus;
};

export type Image = {
  __typename?: 'Image';
  height: Scalars['Float']['output'];
  url?: Maybe<Scalars['String']['output']>;
  width: Scalars['Float']['output'];
};

export type Mix = {
  __typename?: 'Mix';
  firstVideo: VideoSmall;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  back: Scalars['Boolean']['output'];
  clearQueue: Scalars['Boolean']['output'];
  move: Scalars['Boolean']['output'];
  pause: Scalars['Boolean']['output'];
  playPlaylist: Scalars['Boolean']['output'];
  playSong: Scalars['Boolean']['output'];
  queueAddBack: Scalars['Boolean']['output'];
  queueAddFront: Scalars['Boolean']['output'];
  remove: Scalars['Boolean']['output'];
  removeFromQueue: Scalars['Boolean']['output'];
  resume: Scalars['Boolean']['output'];
  seek: Scalars['Boolean']['output'];
  skip: Scalars['Boolean']['output'];
  toggleAutoPlay: Scalars['Boolean']['output'];
  toggleLoop: Scalars['Boolean']['output'];
};


export type MutationMoveArgs = {
  from: Scalars['Int']['input'];
  to: Scalars['Int']['input'];
};


export type MutationPlayPlaylistArgs = {
  clearQueue: Scalars['Boolean']['input'];
  index: Scalars['Int']['input'];
  playlistID: Scalars['String']['input'];
};


export type MutationPlaySongArgs = {
  url: Scalars['String']['input'];
};


export type MutationQueueAddBackArgs = {
  url: Scalars['String']['input'];
};


export type MutationQueueAddFrontArgs = {
  url: Scalars['String']['input'];
};


export type MutationRemoveArgs = {
  index: Scalars['Int']['input'];
};


export type MutationRemoveFromQueueArgs = {
  index: Scalars['Int']['input'];
};


export type MutationSeekArgs = {
  seconds: Scalars['Int']['input'];
};

export type Owner = {
  __typename?: 'Owner';
  channelID: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Playlist = {
  __typename?: 'Playlist';
  firstVideo?: Maybe<VideoSmall>;
  owner?: Maybe<Owner>;
  playlistID: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type PlaylistPage = {
  __typename?: 'PlaylistPage';
  author: Owner;
  bestThumbnail: Image;
  description?: Maybe<Scalars['String']['output']>;
  lastUpdated: Scalars['String']['output'];
  title: Scalars['String']['output'];
  videos: Array<Video>;
};

export type Query = {
  __typename?: 'Query';
  discordPlayer: DiscordPlayer;
  getChannel: ChannelPage;
  getPlaylist: PlaylistPage;
  me: User;
  search: Search;
};


export type QueryGetChannelArgs = {
  channelID: Scalars['String']['input'];
};


export type QueryGetPlaylistArgs = {
  playlistID: Scalars['String']['input'];
};


export type QuerySearchArgs = {
  query: Scalars['String']['input'];
};

export type RequestedBy = {
  __typename?: 'RequestedBy';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type Search = {
  __typename?: 'Search';
  channels: Array<Channel>;
  mixes: Array<Mix>;
  playlists: Array<Playlist>;
  videos: Array<Video>;
};

export type Song = {
  __typename?: 'Song';
  authorAvatar: Scalars['String']['output'];
  authorId: Scalars['String']['output'];
  authorName: Scalars['String']['output'];
  authorUrl: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  requestedBy: RequestedBy;
  thumbnail: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  videoId: Scalars['String']['output'];
};

export type Statistics = {
  __typename?: 'Statistics';
  subscriberCount: Scalars['Float']['output'];
  videoCount: Scalars['Float']['output'];
  viewCount: Scalars['Float']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  discordPlayerSubscription: DiscordPlayer;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  guildIcon: Scalars['String']['output'];
  guildId: Scalars['String']['output'];
  guildName: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type Video = {
  __typename?: 'Video';
  author?: Maybe<VideoAuthor>;
  bestThumbnail: Image;
  duration?: Maybe<Scalars['String']['output']>;
  durationSeconds?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type VideoAuthor = {
  __typename?: 'VideoAuthor';
  bestAvatar?: Maybe<Image>;
  channelID: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type VideoSmall = {
  __typename?: 'VideoSmall';
  bestThumbnail: Image;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, avatar: string, displayName: string, guildId: string, guildName: string, guildIcon: string } };


export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"guildId"}},{"kind":"Field","name":{"kind":"Name","value":"guildName"}},{"kind":"Field","name":{"kind":"Name","value":"guildIcon"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;