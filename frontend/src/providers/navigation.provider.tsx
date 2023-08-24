/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import SelectedTab from "../types/selected-tab.type";

export interface Navigation {
  selectedTab: SelectedTab;
  setSelectedTab: (tab: SelectedTab) => void;
  selectedChannel?: string;
  setSelectedChannel: (channel: string) => void;
  selectedPlaylist?: string;
  setSelectedPlaylist: (playlist: string) => void;
}

const NavigationContext = createContext<Navigation>({
  selectedTab: SelectedTab.Search,
  setSelectedTab: () => {},
  selectedChannel: undefined,
  setSelectedChannel: () => {},
  selectedPlaylist: undefined,
  setSelectedPlaylist: () => {},
});

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

const NavigationProvider = ({ children }: { children?: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(
    SelectedTab.Search
  );
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>(
    undefined
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | undefined>(
    undefined
  );

  return (
    <NavigationContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        selectedChannel,
        selectedPlaylist,
        setSelectedChannel,
        setSelectedPlaylist,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationProvider, useNavigation };
