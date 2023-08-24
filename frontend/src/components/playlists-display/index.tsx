import { Playlist } from "../../gql/graphql";
import PlaylistItem, { PlaylistItemSkeleton } from "./playlist-item";
import "./style.scss";

type PlaylistDisplayProps = {
  playlists?: Playlist[];
};

export default function PlaylistDisplay({ playlists }: PlaylistDisplayProps) {
  if (!playlists?.length) return <></>;
  return (
    <>
      <h1>Playlists</h1>
      <div className="playlists-display">
        {playlists.map((playlist, index) => (
          <PlaylistItem playlist={playlist} key={index} />
        ))}
      </div>
    </>
  );
}

export function PlaylistDisplaySkeleton() {
  return (
    <>
      <h1>Playlists</h1>
      <div className="playlists-display">
        {[...Array(3)].map((_, index) => (
          <PlaylistItemSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
