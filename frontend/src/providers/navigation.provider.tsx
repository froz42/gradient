/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SelectedTab from "../types/selected-tab.type";

type NavigationState = {
  selectedTab: SelectedTab;
  params: Map<string, string>;
};

export interface Navigation {
  navigationState: NavigationState;
  pushState: (state: Partial<NavigationState>) => void;
}

const NavigationContext = createContext<Navigation | undefined>(undefined);

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

const matchPrefix = (prefix: string, path: string): boolean => {
  // remove / from path
  const pathWithoutSlash = path.slice(1);
  return pathWithoutSlash.startsWith(prefix);
};

const getNavigationState = (location: Location): NavigationState => {
  const urlParams = new URLSearchParams(location.search);
  const params = new Map<string, string>();
  urlParams.forEach((value, key) => {
    params.set(key, value);
  });
  const path = location.pathname;
  const selectedTab =
    Object.values(SelectedTab).find((tab) => matchPrefix(tab, path)) ||
    SelectedTab.Search;
  return { selectedTab, params };
};

const NavigationProvider = ({ children }: { children?: React.ReactNode }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    getNavigationState(window.location)
  );

  const pushState = useCallback((state: Partial<NavigationState>) => {
    setNavigationState((prevState) => {
      const selectedTab = state.selectedTab || prevState.selectedTab;
      if (!state.params && state.selectedTab === prevState.selectedTab) {
        return prevState;
      }
      const params = state.params || new Map<string, string>();
      return { selectedTab, params };
    });
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams();
    navigationState.params.forEach((value, key) => {
      urlParams.set(key, value);
    });
    const path = navigationState.selectedTab;
    let url = path.toString();
    if (urlParams.size > 0) {
      url += "?" + urlParams.toString();
    }
    window.history.pushState({}, "", url);
  }, [navigationState]);

  // on back forward ...
  useEffect(() => {
    const handlePopState = () => {
      setNavigationState(getNavigationState(window.location));
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ navigationState, pushState }}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationProvider, useNavigation };
