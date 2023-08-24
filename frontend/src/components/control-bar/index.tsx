import {
  faBarsStaggered,
  faInfinity,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo } from "react";
import { usePlayer } from "../../providers/player.provider";
import SelectedTab from "../../types/selected-tab.type";
import ControlButtons from "./control-buttons";
import PlayingSong from "./playing-song";
import ProgressBar from "./progress-bar";
import "./style.scss";
import { useNavigation } from "../../providers/navigation.provider";
import { useSettings } from "../../providers/settings.provider";

export default function ControlBar() {
  const { player, getCurrentSong, toggleAutoplay, toggleLoop } = usePlayer();
  const { selectedTab, setSelectedTab } = useNavigation();
  const { theme } = useSettings();

  const currentSong = useMemo(() => getCurrentSong(), [getCurrentSong]);

  const handleQueueClick = useCallback(() => {
    setSelectedTab(SelectedTab.Queue);
  }, [setSelectedTab]);

  const className = useMemo(() => {
    return `control-bar ${theme}`;
  }, [theme]);

  const classNameInfiniteIconContainer = useMemo(() => {
    if (!player?.nextAutoPlay) return "icon-container";
    return "icon-container active";
  }, [player?.nextAutoPlay]);

  const classNameRepeatIconContainer = useMemo(() => {
    if (!player?.isLoopEnabled) return "icon-container";
    return "icon-container active";
  }, [player?.isLoopEnabled]);

  const classNameQueueIconContainer = useMemo(() => {
    if (selectedTab !== SelectedTab.Queue) return "icon-container";
    return "icon-container active";
  }, [selectedTab]);

  return (
    <div className={className}>
      <PlayingSong song={currentSong} />
      <ControlButtons />
      <ProgressBar
        currentSecond={player?.playbackDuration || 0}
        totalSecond={currentSong?.duration || 0}
        playerStatus={player?.status}
      />
      <div className={classNameRepeatIconContainer} onClick={toggleLoop}>
        <FontAwesomeIcon icon={faRepeat} className="icon" />
      </div>
      <div className={classNameInfiniteIconContainer} onClick={toggleAutoplay}>
        <FontAwesomeIcon icon={faInfinity} className="icon" />
      </div>
      <div className={classNameQueueIconContainer} onClick={handleQueueClick}>
        <FontAwesomeIcon icon={faBarsStaggered} className="icon" />
      </div>
    </div>
  );
}
