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
import useTheme from "../../hooks/useTheme";

export default function SideBar() {
  const { selectedTab, setSelectedTab } = useNavigation();

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
