import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Playlist } from "../../gql/graphql";
import LoadingPlaceholder from "../atoms/loading-placeholder";
import { useNavigation } from "../../providers/navigation.provider";
import { useCallback } from "react";
import SelectedTab from "../../types/selected-tab.type";
import useTheme from "../../hooks/use-theme";
import { usePlayer } from "../../providers/player.provider";

type PlaylistProps = {
  playlist: Playlist;
};

export default function PlaylistItem({ playlist }: PlaylistProps) {
  const { setSelectedTab, setSelectedPlaylist } = useNavigation();
  const onClick = useCallback(() => {
    setSelectedPlaylist(playlist.playlistID);
    setSelectedTab(SelectedTab.Playlist);
  }, [playlist.playlistID, setSelectedPlaylist, setSelectedTab]);

  const { playPlaylist } = usePlayer();

  const handlePlayClick = useCallback(
    (e: React.MouseEvent) => {
      playPlaylist(playlist.playlistID, 0, true);
      e.stopPropagation();
    },
    [playPlaylist, playlist.playlistID]
  );

  const className = useTheme("playlist");
  return (
    <div className={className} onClick={onClick}>
      <img src={playlist.firstVideo?.bestThumbnail?.url} alt="thumbnail" />
      <div className="info">
        <p className="name">{playlist.title}</p>
        <p className="owner">By {playlist.owner.name}</p>
      </div>
      <div className="play-button">
        <FontAwesomeIcon
          icon={faPlay}
          className="play-icon"
          onClick={handlePlayClick}
        />
      </div>
    </div>
  );
}

export function PlaylistItemSkeleton() {
  return <LoadingPlaceholder className="playlist" />;
}
