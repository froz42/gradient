import {
  faCopy,
  faListOl,
  faListUl,
  faPlay,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export interface GenerateSongMenuOptions {
  url: string;
  play: (url: string) => void;
  queueAddFront: (url: string) => void;
  queueAddBack: (url: string) => void;
}

export default function generateSongMenu({
  url,
  play,
  queueAddFront,
  queueAddBack,
}: GenerateSongMenuOptions) {
  return [
    [
      {
        label: "Play",
        icon: faPlay,
        onClick: () => play(url),
      },
    ],
    [
      {
        label: "Play next",
        icon: faListUl,
        onClick: () => queueAddFront(url),
      },
      {
        label: "Add to queue",
        icon: faListOl,
        onClick: () => queueAddBack(url),
      },
    ],
    [
      {
        label: "Go to channel",
        icon: faUser,
      },
    ],
    [
      {
        label: "Copy video URL",
        icon: faCopy,
        onClick: () => navigator.clipboard.writeText(url),
      },
    ],
  ];
}
