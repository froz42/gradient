import useTheme from "../../hooks/useTheme";
import { ContextMenuState } from "../../providers/context-menu.provider";
import ModalItem from "./modal-item";
import "./style.scss";

interface ContextMenuModalProps {
  contextMenuState?: ContextMenuState;
}

export default function ContextMenuModal({
  contextMenuState,
}: ContextMenuModalProps) {
  const className = useTheme("context-menu-modal");
  if (!contextMenuState) return <></>;
  return (
    <div
      className={className}
      style={{
        top: contextMenuState.coordinates.y,
        left: contextMenuState.coordinates.x,
      }}
    >
      {contextMenuState.menuItems.map((menuItem, index) =>
        menuItem.type === "divider" ? (
          <hr key={index} />
        ) : (
          <ModalItem item={menuItem} key={index} />
        )
      )}
    </div>
  );
}
