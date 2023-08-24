import { useCallback, useMemo } from "react";
import { Song } from "../../../gql/graphql";
import { useNavigation } from "../../../providers/navigation.provider";
import "./style.scss";
import SelectedTab from "../../../types/selected-tab.type";
import useTheme from "../../../hooks/useTheme";

export type PlayingSongProps = {
  song?: Song;
  className?: string;
};

export default function PlayingSong({ song, className }: PlayingSongProps) {
  const { setSelectedChannel, setSelectedTab } = useNavigation();

  const classNameTheme = useTheme("playing-song");
  const classNamePlayingSong = useMemo(() => {
    return classNameTheme + (className ? ` ${className}` : "");
  }, [className, classNameTheme]);

  const handleOnClick = useCallback(() => {
    if (!song) return;
    setSelectedChannel(song.authorId);
    setSelectedTab(SelectedTab.Channel);
  }, [song, setSelectedChannel, setSelectedTab]);

  if (!song) {
    return <div className={classNameTheme} />;
  }
  const { title, authorName, thumbnail } = song;

  return (
    <div className={classNamePlayingSong}>
      <div className="thumbnail">
        <img src={thumbnail} alt={title} />
      </div>
      <div>
        <p className="title">{title}</p>
        <p className="artist" onClick={handleOnClick}>
          {authorName}
        </p>
      </div>
    </div>
  );
}
