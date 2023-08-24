import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import SelectedTab from "../../../types/selected-tab.type";
import "./style.scss";
import { useSettings } from "../../../providers/settings.provider";

type MenuElemProps = {
  icon: IconDefinition;
  slug: SelectedTab;
  text: string;
  onClick?: (slug: SelectedTab) => void;
  selected?: boolean;
};

export default function MenuElem({
  icon,
  slug,
  text,
  onClick,
  selected,
}: MenuElemProps) {
  const { theme } = useSettings();
  const className = useMemo(() => {
    let className = `menu-elem ${theme}`;
    if (selected) {
      className += " selected";
    }
    return className;
  }, [selected, theme]);

  return (
    <div className={className} onClick={() => onClick?.(slug)}>
      <FontAwesomeIcon className="icon" icon={icon} />
      <div className="text">{text}</div>
    </div>
  );
}
