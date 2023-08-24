import { useCallback, useEffect, useState } from "react";
import { useError } from "../../providers/error.provider";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const REMAINING_TIME_MS = 5000;

export default function ErrorDisplay() {
  const { error } = useError();
  const [, setRemainingTime] = useState<number | undefined>(undefined);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      setRemainingTime(REMAINING_TIME_MS);
      const interval = setInterval(() => {
        setRemainingTime((remainingTime) => {
          if (remainingTime === undefined) return undefined;
          if (remainingTime <= 0) {
            clearInterval(interval);
            setIsError(false);
            return undefined;
          }
          return remainingTime - 100;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [error]);

  const handleClose = useCallback(() => {
    setIsError(false);
  }, []);

  if (!isError) return <></>;

  return (
    <div className="error-display">
      <h1>Error</h1>
      <p>{error}</p>
      <FontAwesomeIcon icon={faClose} className="icon" onClick={handleClose} />
      <div className="progress-bar-error">
        <div className="fill" />
      </div>
    </div>
  );
}
