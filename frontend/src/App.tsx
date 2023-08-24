import { useState } from "react";
import ControlBar from "./components/control-bar";
import DashContainer from "./components/dash-container";
import SearchBar from "./components/search-bar";
import SideBar from "./components/side-bar";
import useTheme from "./hooks/useTheme";
import ErrorDisplay from "./components/error-display";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const className = useTheme('app-container');
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
