import { Video } from "../../gql/graphql";
import Song, { SongSkeleton } from "./song";
import "./style.scss";

type SongsDisplayProps = {
  videos?: Video[];
  title?: string;
};

export default function SongsDisplay({ videos, title }: SongsDisplayProps) {
  if (!videos?.length) return <></>;
  return (
    <>
      <h1>{title || "Videos"}</h1>
      <div className="songs-display">
        {videos.map((video, index) => (
          <Song video={video} key={index} />
        ))}
      </div>
    </>
  );
}

export function SongsDisplaySkeleton() {
  return (
    <>
      <h1>Videos</h1>
      <div className="songs-display">
        {[...Array(7)].map((_, index) => (
          <SongSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
