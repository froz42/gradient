import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DiscordPlayer } from "../../../../../gql/graphql";
import { usePlayer } from "../../../../../providers/player.provider";
import DraggableQueueElem from "../draggable-queue-elem";
import "./style.scss";

type QueueNextProps = {
  player: DiscordPlayer;
};

export default function QueueNext({ player }: QueueNextProps) {
  const { move } = usePlayer();
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      move(dragIndex, hoverIndex);
    },
    [move]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="queue-next">
        {player.queue.slice(player.currentQueueIndex + 1).map((song, index) => (
          <DraggableQueueElem
            key={song.id}
            index={player.currentQueueIndex + 1 + index}
            displayIndex={index + 2}
            id={song.id}
            song={song}
            moveCard={moveCard}
            isDraggable
          />
        ))}
      </div>
    </DndProvider>
  );
}
