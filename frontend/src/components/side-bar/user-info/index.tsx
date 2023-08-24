import { useCallback, useMemo } from "react";
import { DiscordUrl } from "../../../utils/discord-url";
import useMe from "../../../hooks/use-me";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import useTheme from "../../../hooks/use-theme";
import { useNavigation } from "../../../providers/navigation.provider";
import SelectedTab from "../../../types/selected-tab.type";

export default function UserInfo() {
  const { me } = useMe();
  const userIcon = useMemo(() => {
    if (!me) return "";
    return DiscordUrl.getAvatarURL(me.id, me.avatar);
  }, [me]);

  const { setSelectedTab } = useNavigation();

  const handleClick = useCallback(() => {
    setSelectedTab(SelectedTab.Settings);
  }, [setSelectedTab]);

  const className = useTheme("user-info");

  return (
    <div className={className}>
      <div className="group-1">
        <img src={userIcon} alt="user icon" />
        <p>{me?.displayName}</p>
      </div>
      <FontAwesomeIcon
        icon={faGear}
        className="gear-icon"
        onClick={handleClick}
      />
    </div>
  );
}
