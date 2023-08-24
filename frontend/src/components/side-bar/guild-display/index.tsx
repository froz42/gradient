import { useMemo } from "react";
import useMe from "../../../hooks/useMe";
import { DiscordUrl } from "../../../utils/discord-url";
import "./style.scss";
import useTheme from "../../../hooks/useTheme";

export default function GuildDisplay() {
  const { me } = useMe();
  const guildIcon = useMemo(() => {
    if (!me) return "";
    return DiscordUrl.getIconURL(me.guildId, me.guildIcon);
  }, [me]);
  const className = useTheme("guild-display-container");
  return (
    <div className={className}>
      <div className="guild-display">
        <img src={guildIcon} alt="guild icon" />
        <p>{me?.guildName}</p>
      </div>
    </div>
  );
}
