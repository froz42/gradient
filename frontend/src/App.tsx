import { useEffect, useState } from "react";
import ControlBar from "./components/control-bar";
import DashContainer from "./components/dash-container";
import SearchBar from "./components/search-bar";
import SideBar from "./components/side-bar";
import useTheme from "./hooks/use-theme";
import ErrorDisplay from "./components/error-display";
import { useNavigation } from "./providers/navigation.provider";
import SelectedTab from "./types/selected-tab.type";

function App() {
  const {
    navigationState: { params, selectedTab },
  } = useNavigation();
  const [searchQuery, setSearchQuery] = useState<string>(
    (selectedTab === SelectedTab.Search && params.get("query")) || ""
  );
  useEffect(() => {
    if (selectedTab === SelectedTab.Search) {
      setSearchQuery(params.get("query") || "");
    }
  }, [params, selectedTab]);
  const className = useTheme("app-container");
  return (
    <div className={className}>
      <SideBar />
      <DashContainer searchQuery={searchQuery} />
      <ControlBar />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ErrorDisplay />
    </div>
  );
}

export default App;
