import { useMemo } from "react";
import { usePlayer } from "../../../../providers/player.provider";
import QueueElem from "./queue-elem";
import QueueNext from "./queue-next";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useTheme from "../../../../hooks/use-theme";

export default function Queue() {
  const { player, clearQueue } = usePlayer();

  const firstSong = useMemo(
    () => player?.queue[player.currentQueueIndex],
    [player]
  );

  const className = useTheme("queue");

  return (
    <div className={className}>
      <h1>Queue</h1>
      {firstSong && (
        <>
          <h2>Now Playing</h2>
          <QueueElem song={firstSong} index={1} />
        </>
      )}
      {player && player.queue.length - 1 > player.currentQueueIndex && (
        <>
          <div className="up-next">
            <h2>Up Next</h2>
            <FontAwesomeIcon
              icon={faTrashCan}
              className="clear-queue"
              onClick={clearQueue}
            />
          </div>
          <QueueNext player={player} />
        </>
      )}
      {player?.nextAutoPlay && (
        <>
          <h2>Auto Play</h2>
          <QueueElem
            song={player.nextAutoPlay}
            index={player.queue.length - player.currentQueueIndex + 1}
          />
        </>
      )}
    </div>
  );
}
