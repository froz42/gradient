import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "../../../../providers/navigation.provider";
import "./style.scss";
import { ChannelPage as ChannelPageType } from "../../../../gql/graphql";
import { useLazyQuery } from "@apollo/client";
import GET_CHANNEL_QUERY from "../../../../gql/queries/get-channel-query";
import SongsDisplay, { SongsDisplaySkeleton } from "../../../songs-display";
import PlaylistDisplay, {
  PlaylistDisplaySkeleton,
} from "../../../playlists-display";
import LoadingPlaceholder from "../../../atoms/loading-placeholder";
import useTheme from "../../../../hooks/use-theme";

function ChannelPageSkeleton() {
  const className = useTheme("channel-page");
  return (
    <div className={className}>
      <LoadingPlaceholder className="banner" />
      <LoadingPlaceholder className="avatar" />
      <div className="infos">
        <h1 className="name"></h1>
        <div className="stats">
          <p className="subscribers"></p>
          <p className="views"></p>
          <p className="videos"></p>
        </div>
      </div>
      <div className="content">
        <SongsDisplaySkeleton />
        <PlaylistDisplaySkeleton />
      </div>
    </div>
  );
}

export default function ChannelPage() {
  const {
    navigationState: { params },
  } = useNavigation();
  const [channel, setChannel] = useState<ChannelPageType | null>(null);
  const [getChannel] = useLazyQuery<{ getChannel: ChannelPageType }>(
    GET_CHANNEL_QUERY
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const selectedChannel = params.get("channelID");
      if (selectedChannel) {
        setIsLoading(true);
        const channel = await getChannel({
          variables: { channelID: selectedChannel },
        });
        setIsLoading(false);
        channel.data && setChannel(channel.data.getChannel);
      }
    };
    fetchData();
  }, [getChannel, params]);

  const { subscriberCount, viewCount, videoCount } = useMemo(() => {
    const formatter = Intl.NumberFormat(undefined, { notation: "compact" });
    return {
      subscriberCount: formatter.format(
        Number(channel?.statistics.subscriberCount)
      ),
      viewCount: formatter.format(Number(channel?.statistics.viewCount)),
      videoCount: formatter.format(Number(channel?.statistics.videoCount)),
    };
  }, [
    channel?.statistics.subscriberCount,
    channel?.statistics.viewCount,
    channel?.statistics.videoCount,
  ]);

  const className = useTheme("channel-page");

  if (isLoading || !channel) return <ChannelPageSkeleton />;
  return (
    <div className={className}>
      <img className="banner" src={channel.banner} />
      <img className="avatar" src={channel.thumbnail} />
      <div className="infos">
        <h1 className="name">{channel.name}</h1>
        <div className="stats">
          <p className="subscribers">{subscriberCount} subscribers</p>
          <p className="views">{viewCount} views</p>
          <p className="videos">{videoCount} videos</p>
        </div>
      </div>
      <div className="content">
        <SongsDisplay title="Most viewed videos" videos={channel.videos} />
        <PlaylistDisplay playlists={channel.playlists} />
      </div>
    </div>
  );
}
