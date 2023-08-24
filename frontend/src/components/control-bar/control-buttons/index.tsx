import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { AudioPlayerStatus } from "../../../gql/graphql";
import { usePlayer } from "../../../providers/player.provider";
import "./style.scss";
import useTheme from "../../../hooks/use-theme";

export default function ControlButtons() {
  const { player, pause, resume, skip, back } = usePlayer();

  const handlePlay = useCallback(() => {
    switch (player?.status) {
      case AudioPlayerStatus.Playing:
        pause();
        break;
      case AudioPlayerStatus.Paused:
        resume();
        break;
      default:
        break;
    }
  }, [player, pause, resume]);
  const className = useTheme("control-buttons");
  return (
    <div className={className}>
      <FontAwesomeIcon
        className="backward control-icon"
        icon={faBackwardStep}
        onClick={back}
      />
      <div className="play-round" onClick={handlePlay}>
        {
          <FontAwesomeIcon
            className="play-icon"
            icon={
              player?.status === AudioPlayerStatus.Playing ? faPause : faPlay
            }
          />
        }
      </div>
      <FontAwesomeIcon
        className="forward control-icon"
        icon={faForwardStep}
        onClick={skip}
      />
    </div>
  );
}
