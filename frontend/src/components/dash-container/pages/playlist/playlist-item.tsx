import { useCallback } from "react";
import { Video } from "../../../../gql/graphql";
import { usePlayer } from "../../../../providers/player.provider";
import {
  faPlay,
  faListUl,
  faListOl,
  faUser,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { useContextMenu } from "../../../../providers/context-menu.provider";
import { useNavigation } from "../../../../providers/navigation.provider";
import SelectedTab from "../../../../types/selected-tab.type";
import { MenuBuilder, MenuItemBuilder } from "../../../../utils/menu-builder";
import useIsCurrentSong from "../../../../hooks/use-is-current-song";
import PlayingIndicator from "../../../atoms/playing-indicator";
import useTheme from "../../../../hooks/useTheme";

type PlaylistItemProps = {
  index: number;
  playlistID: string;
  video: Video;
};

export default function PlaylistItem({
  index,
  video,
  playlistID,
}: PlaylistItemProps) {
  const { play, queueAddBack, queueAddFront, playPlaylist } = usePlayer();
  const { open } = useContextMenu();
  const { setSelectedTab, setSelectedChannel } = useNavigation();
  const handleOnChannelOpen = useCallback(() => {
    setSelectedChannel(video.author.channelID);
    setSelectedTab(SelectedTab.Channel);
  }, [setSelectedChannel, video.author.channelID, setSelectedTab]);

  const [isCurrentSong, isCurrentSongPlaying] = useIsCurrentSong(video.id);

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
    playPlaylist(playlistID, index, true);
  }, [playlistID, index, playPlaylist]);

  const className = useTheme("playlist-item");

  return (
    <div
      className={className}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className="index">
        {isCurrentSong ? (
          <PlayingIndicator
            isPlaying={isCurrentSongPlaying}
            className="playing-indicator"
          />
        ) : (
          index + 1
        )}
      </div>
      <img src={video.bestThumbnail?.url} />
      <div className="info">
        <p className="name">{video.title}</p>
        <p className="author">{video.author.name}</p>
      </div>
      <p className="duration">{video.duration}</p>
    </div>
  );
}
