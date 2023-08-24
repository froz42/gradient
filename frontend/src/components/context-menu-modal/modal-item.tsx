import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuItemButton } from "../../providers/context-menu.provider";

interface ModalItemProps {
  item: MenuItemButton;
}

export default function ModalItem({ item }: ModalItemProps) {
  return (
    <div className="modal-item" onClick={item.onClick}>
      <span className="label">{item.label}</span>
      {item.icon && <FontAwesomeIcon icon={item.icon} className="icon" />}
    </div>
  );
}
