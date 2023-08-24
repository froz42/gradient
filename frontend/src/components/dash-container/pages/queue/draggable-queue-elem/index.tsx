import { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import QueueElem, { QueueElemProps } from "../queue-elem";
import { ItemTypes } from "./item-types.const";
import type { Identifier, XYCoord } from "dnd-core";
import "./style.scss";
import { usePlayer } from "../../../../../providers/player.provider";
import {
  faSquareMinus,
  faListUl,
  faListOl,
  faUser,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import {
  MenuBuilder,
  MenuItemBuilder,
} from "../../../../../utils/menu-builder";
import { useContextMenu } from "../../../../../providers/context-menu.provider";
import { useNavigation } from "../../../../../providers/navigation.provider";
import SelectedTab from "../../../../../types/selected-tab.type";

type DraggableQueueElemProps = QueueElemProps & {
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  index: number;
  displayIndex: number;
  id: string;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function DraggableQueueElem(props: DraggableQueueElemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >(
    {
      accept: ItemTypes.QUEUE_ELEM,
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item: DragItem, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        props.moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    },
    [props.moveCard, props.index]
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.QUEUE_ELEM,
      item: () => {
        return { index: props.index, id: props.id };
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [props.index, props.id]
  );

  const { queueAddBack, queueAddFront, queueRemove } = usePlayer();
  const { open } = useContextMenu();
  const { setSelectedTab, setSelectedChannel } = useNavigation();
  const handleOnChannelOpen = useCallback(() => {
    setSelectedChannel(props.song.authorId);
    setSelectedTab(SelectedTab.Channel);
  }, [setSelectedChannel, props.song.authorId, setSelectedTab]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const menuBuilder = new MenuBuilder();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Remove from queue")
          .withIcon(faSquareMinus)
          .withOnClick(() => queueRemove(props.index))
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Play next")
          .withIcon(faListUl)
          .withOnClick(() => queueAddFront(props.song.url))
          .build()
      );
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Add to queue")
          .withIcon(faListOl)
          .withOnClick(() => queueAddBack(props.song.url))
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Go to channel")
          .withIcon(faUser)
          .withOnClick(handleOnChannelOpen)
          .build()
      );
      menuBuilder.addDivider();
      menuBuilder.addMenuItem(
        new MenuItemBuilder("Copy URL")
          .withIcon(faCopy)
          .withOnClick(() => navigator.clipboard.writeText(props.song.url))
          .build()
      );
      open({ x: event.clientX, y: event.clientY }, menuBuilder.build());
      event.preventDefault();
    },
    [
      handleOnChannelOpen,
      open,
      props.index,
      props.song.url,
      queueAddBack,
      queueAddFront,
      queueRemove,
    ]
  );

  drag(drop(ref));
  return (
    <div
      className="draggable-queue-elem"
      ref={ref}
      data-handler-id={handlerId}
      onContextMenu={handleContextMenu}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
    >
      <QueueElem index={props.displayIndex} song={props.song} />
    </div>
  );
}
