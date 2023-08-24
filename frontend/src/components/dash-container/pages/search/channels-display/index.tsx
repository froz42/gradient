import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Channel } from "../../../../../gql/graphql";
import "./style.scss";
import { useNavigation } from "../../../../../providers/navigation.provider";
import { useCallback } from "react";
import SelectedTab from "../../../../../types/selected-tab.type";
import LoadingPlaceholder from "../../../../atoms/loading-placeholder";
import { useContextMenu } from "../../../../../providers/context-menu.provider";
import {
  MenuBuilder,
  MenuItemBuilder,
} from "../../../../../utils/menu-builder";
import useTheme from "../../../../../hooks/useTheme";

type ChannelsDisplayProps = {
  channels?: Channel[];
};

function ChannelItem({ channel }: { channel: Channel }) {
  const { setSelectedChannel, setSelectedTab } = useNavigation();
  const onClick = useCallback(() => {
    setSelectedChannel(channel.channelID);
    setSelectedTab(SelectedTab.Channel);
  }, [channel.channelID, setSelectedChannel, setSelectedTab]);

  const { open } = useContextMenu();
  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const menuBuilder = new MenuBuilder();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Copy URL")
          .withIcon(faCopy)
          .withOnClick(() => navigator.clipboard.writeText(channel.url))
          .build()
      );
      open({ x: event.clientX, y: event.clientY }, menuBuilder.build());
      event.preventDefault();
    },
    [channel.url, open]
  );

  return (
    <div
      className="channel"
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <img src={channel.bestAvatar?.url || ""} alt="avatar" />
      <div className="info">
        <p className="name">
          {channel.name}
          {channel.verified && (
            <FontAwesomeIcon icon={faCheckCircle} className="verified" />
          )}
        </p>
      </div>
    </div>
  );
}

function ChannelItemSkeleton() {
  return <LoadingPlaceholder className="channel" />;
}

export default function ChannelsDisplay({ channels }: ChannelsDisplayProps) {
  const className = useTheme("channels-display");
  if (!channels?.length) return <></>;
  return (
    <>
      <h1>Channels</h1>
      <div className={className}>
        {channels.map((channel, index) => (
          <ChannelItem channel={channel} key={index} />
        ))}
      </div>
    </>
  );
}

export function ChannelsDisplaySkeleton() {
  return (
    <>
      <h1>Channels</h1>
      <div className="channels-display">
        {[...Array(3)].map((_, index) => (
          <ChannelItemSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
