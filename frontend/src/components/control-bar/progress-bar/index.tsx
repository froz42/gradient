import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioPlayerStatus } from "../../../gql/graphql";
import { usePlayer } from "../../../providers/player.provider";
import getFormattedTime from "../../../utils/get-formated-time";
import "./style.scss";
import useTheme from "../../../hooks/use-theme";

type TimeTrack = {
  timeMs: number;
  previousFrame?: Date;
};

export type ProgressBarProps = {
  currentSecond: number;
  totalSecond: number;
  playerStatus?: AudioPlayerStatus;
};

export default function ProgressBar({
  currentSecond,
  totalSecond,
  playerStatus,
}: ProgressBarProps) {
  const { seek } = usePlayer();
  const [timeTrack, setTimeTrack] = useState<TimeTrack>({
    timeMs: currentSecond * 1000,
    previousFrame: undefined,
  });

  useEffect(() => {
    if (playerStatus !== AudioPlayerStatus.Playing)
      setTimeTrack((timeTrack) => ({
        ...timeTrack,
        previousFrame: undefined,
      }));
  }, [playerStatus]);

  useEffect(() => {
    setTimeTrack((timeTrack) => ({
      ...timeTrack,
      timeMs: currentSecond * 1000,
    }));
    if (playerStatus === AudioPlayerStatus.Playing) {
      const interval = setInterval(() => {
        setTimeTrack((timeTrack) => {
          if (!timeTrack.previousFrame)
            return {
              timeMs: timeTrack.timeMs,
              previousFrame: new Date(),
            };
          const now = new Date();
          const timeDiff = now.getTime() - timeTrack.previousFrame.getTime();
          if (timeTrack.timeMs + timeDiff >= totalSecond * 1000) {
            return {
              timeMs: totalSecond * 1000,
              previousFrame: now,
            };
          }
          return {
            timeMs: timeTrack.timeMs + timeDiff,
            previousFrame: now,
          };
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentSecond, playerStatus, totalSecond]);

  const setSeek = useCallback(
    (timeMs: number) => {
      setTimeTrack((timeTrack) => ({
        ...timeTrack,
        timeMs,
        previousFrame: new Date(),
      }));
      seek(Math.floor(timeMs / 1000));
    },
    [seek]
  );

  const percent = useMemo(() => {
    if (totalSecond === 0) return 0;
    return (timeTrack.timeMs / (totalSecond * 1000)) * 100;
  }, [timeTrack.timeMs, totalSecond]);

  const className = useTheme("progress-bar");

  return (
    <div className={className}>
      <p className="time">{getFormattedTime(timeTrack.timeMs)}</p>
      <div className="slider-container">
        <div className="progress" style={{ width: `${percent}%` }} />
        <input
          className="slider"
          type="range"
          min="0"
          max={totalSecond * 1000}
          value={timeTrack.timeMs}
          onChange={(e) => setSeek(parseInt(e.target.value))}
        />
      </div>
      <p className="time">{getFormattedTime(totalSecond * 1000)}</p>
    </div>
  );
}
