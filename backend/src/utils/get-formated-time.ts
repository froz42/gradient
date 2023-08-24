export default function getFormattedTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60).toString();
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }
  const hours = Math.floor(seconds / 3600).toString();
  const remainingMinutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${hours}:${remainingMinutes}:${remainingSeconds}`;
}
