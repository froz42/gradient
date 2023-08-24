import { useMemo } from "react";
import "./style.scss";

type PlayingIndicatorProps = {
  className?: string;
  isPlaying?: boolean;
};

export default function PlayingIndicator({
  className,
  isPlaying,
}: PlayingIndicatorProps) {
  const finalClassName = useMemo(() => {
    if (!className) return "playing-indicator";
    return `playing-indicator ${className}`;
  }, [className]);

  const classNameEven = useMemo(() => {
    if (isPlaying) return "bar-even";
    return "bar-even paused";
  }, [isPlaying]);

  const classNameOdd = useMemo(() => {
    if (isPlaying) return "bar-odd";
    return "bar-odd paused";
  }, [isPlaying]);

  return (
    <div className={finalClassName}>
      <div className={classNameEven} />
      <div className={classNameOdd} />
      <div className={classNameEven} />
      <div className={classNameOdd} />
    </div>
  );
}
