import {
  faBarsStaggered,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SelectedTab from "../../types/selected-tab.type";
import GuildDisplay from "./guild-display";
import MenuElem from "./menu-elem";
import "./style.scss";
import UserInfo from "./user-info";
import { useNavigation } from "../../providers/navigation.provider";
import useTheme from "../../hooks/use-theme";
import { useCallback } from "react";

export default function SideBar() {
  const {
    navigationState: { selectedTab },
    pushState,
  } = useNavigation();

  const setSelectedTab = useCallback(
    (tab: SelectedTab) => {
      pushState({ selectedTab: tab });
    },
    [pushState]
  );

  const className = useTheme("sidebar");
  return (
    <div className={className}>
      <GuildDisplay />
      <MenuElem
        icon={faMagnifyingGlass}
        slug={SelectedTab.Search}
        text="Search"
        selected={selectedTab === SelectedTab.Search}
        onClick={setSelectedTab}
      />
      <MenuElem
        icon={faBarsStaggered}
        slug={SelectedTab.Queue}
        text="Queue"
        selected={selectedTab === SelectedTab.Queue}
        onClick={setSelectedTab}
      />
      <UserInfo />
    </div>
  );
}
