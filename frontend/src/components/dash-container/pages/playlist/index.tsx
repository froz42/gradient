import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "../../../../providers/navigation.provider";
import { PlaylistPage as PlaylistPageType } from "../../../../gql/graphql";
import "./style.scss";
import { useLazyQuery } from "@apollo/client";
import GET_PLAYLIST_QUERY from "../../../../gql/queries/get-playlist-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEllipsis,
  faListOl,
  faPlay,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PlaylistItem from "./playlist-item";
import SelectedTab from "../../../../types/selected-tab.type";
import { usePlayer } from "../../../../providers/player.provider";
import { useContextMenu } from "../../../../providers/context-menu.provider";
import { MenuBuilder, MenuItemBuilder } from "../../../../utils/menu-builder";
import useTheme from "../../../../hooks/useTheme";
import LoadingPlaceholder from "../../../atoms/loading-placeholder";

function PlaylistPageSkeleton() {
  const className = useTheme("playlist-page");

  return (
    <div className={className}>
      <div className="background">
        <LoadingPlaceholder className="image" />
        <div className="filter" />
        <div className="top-infos">
          <LoadingPlaceholder className="thumbnail" />
        </div>
      </div>
      <div className="content">
        <div className="actions">
          <LoadingPlaceholder className="play-icon" />
          <LoadingPlaceholder className="options" />
        </div>
        <hr />
        <div className="videos">
          <LoadingPlaceholder className="playlist-item" />
          <LoadingPlaceholder className="playlist-item" />
          <LoadingPlaceholder className="playlist-item" />
          <LoadingPlaceholder className="playlist-item" />
        </div>
      </div>
    </div>
  );
}

export default function PlaylistPage() {
  const { selectedPlaylist, setSelectedTab, setSelectedChannel } =
    useNavigation();
  const [playlist, setPlaylist] = useState<PlaylistPageType | null>(null);
  const [getPlaylist] = useLazyQuery<{ getPlaylist: PlaylistPageType }>(
    GET_PLAYLIST_QUERY
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPlaylist) {
        setIsLoading(true);
        const playlist = await getPlaylist({
          variables: { playlistID: selectedPlaylist },
        });
        setIsLoading(false);
        playlist.data && setPlaylist(playlist.data.getPlaylist);
      }
    };
    fetchData();
  }, [selectedPlaylist, getPlaylist]);

  const handleChannelClick = useCallback(() => {
    if (!playlist) return;
    setSelectedChannel(playlist.author.channelID);
    setSelectedTab(SelectedTab.Channel);
  }, [playlist, setSelectedChannel, setSelectedTab]);

  const { playPlaylist } = usePlayer();

  const handlePlayClick = useCallback(() => {
    if (!selectedPlaylist) return;
    playPlaylist(selectedPlaylist, 0, true);
  }, [playPlaylist, selectedPlaylist]);

  const { open } = useContextMenu();
  const handleThreeDotsClick = useCallback(
    (event: React.MouseEvent) => {
      if (!selectedPlaylist) return;
      const menuBuilder = new MenuBuilder();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Play")
          .withIcon(faPlay)
          .withOnClick(handlePlayClick)
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Add to queue")
          .withIcon(faListOl)
          .withOnClick(() => playPlaylist(selectedPlaylist, 0, false))
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Go to channel")
          .withIcon(faUser)
          .withOnClick(handleChannelClick)
          .build()
      );
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Copy URL")
          .withIcon(faCopy)
          .withOnClick(() =>
            navigator.clipboard.writeText(
              `https://www.youtube.com/playlist?list=${selectedPlaylist}`
            )
          )
          .build()
      );
      open({ x: event.clientX, y: event.clientY }, menuBuilder.build());
      event.stopPropagation();
    },
    [handleChannelClick, handlePlayClick, open, playPlaylist, selectedPlaylist]
  );

  const className = useTheme("playlist-page");

  if (isLoading || !playlist) return <PlaylistPageSkeleton />;

  return (
    <div className={className}>
      <div className="background">
        <img src={playlist.bestThumbnail.url || ''} className="image" />
        <div className="filter" />
        <div className="top-infos">
          <img src={playlist.bestThumbnail.url || ''} className="thumbnail" />
          <div className="infos">
            <h1 className="name">{playlist.title}</h1>
            <p className="owner" onClick={handleChannelClick}>
              By {playlist.author.name}
            </p>
            <p className="description">{playlist.description}</p>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="actions">
          <FontAwesomeIcon
            icon={faPlay}
            className="play-icon"
            onClick={handlePlayClick}
          />
          <FontAwesomeIcon
            icon={faEllipsis}
            className="options"
            onClick={handleThreeDotsClick}
          />
        </div>
        <hr />
        <div className="videos">
          {playlist.videos.map((video, index) => (
            <PlaylistItem
              key={index}
              index={index}
              video={video}
              playlistID={selectedPlaylist || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}