import { useNavigation } from "../../providers/navigation.provider";
import SelectedTab from "../../types/selected-tab.type";
import ChannelPage from "./pages/channel";
import PlaylistPage from "./pages/playlist";
import Queue from "./pages/queue";
import Search from "./pages/search";
import { SettingsPage } from "./pages/settings";
import "./style.scss";

type DashContainerProps = {
  searchQuery: string;
};

function Dash({
  selectedTab,
  searchQuery,
}: {
  selectedTab: SelectedTab;
  searchQuery: string;
}) {
  switch (selectedTab) {
    case SelectedTab.Queue:
      return <Queue />;
    case SelectedTab.Search:
      return <Search searchQuery={searchQuery} />;
    case SelectedTab.Channel:
      return <ChannelPage />;
    case SelectedTab.Playlist:
      return <PlaylistPage />;
    case SelectedTab.Settings:
      return <SettingsPage />;
  }
  return <></>;
}

export default function DashContainer({ searchQuery }: DashContainerProps) {
  const {
    navigationState: { selectedTab },
  } = useNavigation();
  return (
    <div className="dash-container">
      <Dash selectedTab={selectedTab} searchQuery={searchQuery} />
      <div className="dummy-empty" />
    </div>
  );
}
