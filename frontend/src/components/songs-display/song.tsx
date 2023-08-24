import { useCallback } from "react";
import {
  faCopy,
  faListOl,
  faListUl,
  faPlay,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Video } from "../../gql/graphql";
import { useContextMenu } from "../../providers/context-menu.provider";
import { usePlayer } from "../../providers/player.provider";
import { MenuBuilder, MenuItemBuilder } from "../../utils/menu-builder";
import { useNavigation } from "../../providers/navigation.provider";
import SelectedTab from "../../types/selected-tab.type";
import LoadingPlaceholder from "../atoms/loading-placeholder";
import useTheme from "../../hooks/use-theme";

type SongProps = {
  video: Video;
};

export default function Song({ video }: SongProps) {
  const { play, queueAddBack, queueAddFront } = usePlayer();
  const { open } = useContextMenu();
  const { setSelectedTab, setSelectedChannel } = useNavigation();
  const handleOnChannelOpen = useCallback(() => {
    setSelectedChannel(video.author.channelID);
    setSelectedTab(SelectedTab.Channel);
  }, [setSelectedChannel, video.author.channelID, setSelectedTab]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const menuBuilder = new MenuBuilder();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Play")
          .withIcon(faPlay)
          .withOnClick(() => play(video.url))
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Play next")
          .withIcon(faListUl)
          .withOnClick(() => queueAddFront(video.url))
          .build()
      );
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Add to queue")
          .withIcon(faListOl)
          .withOnClick(() => queueAddBack(video.url))
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Go to channel")
          .withIcon(faUser)
          .withOnClick(handleOnChannelOpen)
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Copy URL")
          .withIcon(faCopy)
          .withOnClick(() => navigator.clipboard.writeText(video.url))
          .build()
      );
      open({ x: event.clientX, y: event.clientY }, menuBuilder.build());
      event.preventDefault();
    },
    [handleOnChannelOpen, open, play, queueAddBack, queueAddFront, video.url]
  );

  const handleClick = useCallback(() => {
    play(video.url);
  }, [play, video.url]);

  const className = useTheme("song");

  return (
    <div
      className={className}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <img src={video.bestThumbnail.url} alt="thumbnail" />
      <div className="info">
        <p className="title">{video.title}</p>
        <p className="channel">{video.author.name}</p>
      </div>
      <p className="duration">{video.duration}</p>
    </div>
  );
}

export function SongSkeleton() {
  return <LoadingPlaceholder className="song" />;
}
