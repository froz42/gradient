import { useCallback } from "react";
import { Song } from "../../../../../gql/graphql";
import getFormattedTime from "../../../../../utils/get-formated-time";
import "./style.scss";
import { usePlayer } from "../../../../../providers/player.provider";
import {
  MenuBuilder,
  MenuItemBuilder,
} from "../../../../../utils/menu-builder";
import {
  faCopy,
  faListOl,
  faListUl,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useContextMenu } from "../../../../../providers/context-menu.provider";
import { useNavigation } from "../../../../../providers/navigation.provider";
import SelectedTab from "../../../../../types/selected-tab.type";
import useIsCurrentSong from "../../../../../hooks/use-is-current-song";
import PlayingIndicator from "../../../../atoms/playing-indicator";
import useTheme from "../../../../../hooks/use-theme";

export type QueueElemProps = {
  song: Song;
  index: number;
  isDraggable?: boolean;
};

export default function QueueElem({
  song,
  index,
  isDraggable,
}: QueueElemProps) {
  const { queueAddBack, queueAddFront } = usePlayer();
  const { open } = useContextMenu();
  const { pushState } = useNavigation();

  const handleOnChannelOpen = useCallback(() => {
    pushState({
      selectedTab: SelectedTab.Channel,
      params: new Map([["channelID", song.authorId]]),
    });
  }, [pushState, song.authorId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCurrentSong, isCurrentSongPlaying] = useIsCurrentSong(song.videoId);

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDraggable) return;
      const menuBuilder = new MenuBuilder();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Play next")
          .withIcon(faListUl)
          .withOnClick(() => queueAddFront(song.url))
          .build()
      );
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Add to queue")
          .withIcon(faListOl)
          .withOnClick(() => queueAddBack(song.url))
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
          .withOnClick(() => navigator.clipboard.writeText(song.url))
          .build()
      );
      open({ x: event.clientX, y: event.clientY }, menuBuilder.build());
      event.preventDefault();
    },
    [
      handleOnChannelOpen,
      isDraggable,
      open,
      queueAddBack,
      queueAddFront,
      song.url,
    ]
  );

  const handleChannelClick = useCallback(() => {
    pushState({
      selectedTab: SelectedTab.Channel,
      params: new Map([["channelID", song.authorId]]),
    });
  }, [pushState, song.authorId]);

  const { title, authorName, thumbnail, duration } = song;

  const className = useTheme("queue-elem");

  return (
    <div className={className} onContextMenu={onContextMenu}>
      <div className="index">
        {isCurrentSong ? (
          <PlayingIndicator
            className="playing-indicator"
            isPlaying={isCurrentSongPlaying}
          />
        ) : (
          index
        )}
      </div>
      <div className="thumbnail">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="song-info">
        <p className="title">{title}</p>
        <p className="artist" onClick={handleChannelClick}>
          {authorName}
        </p>
      </div>
      <p className="duration">{getFormattedTime(duration * 1000)}</p>
    </div>
  );
}
