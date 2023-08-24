/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface Settings {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<Settings | undefined>(undefined);

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  const [themeState, setThemeState] = useState<Theme>(
    (localStorage.getItem("theme") === Theme.Dark && Theme.Dark) || Theme.Light
  );

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem("theme", theme);
    setThemeState(theme);
  }, []);

  return (
    <SettingsContext.Provider value={{ theme: themeState, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, useSettings };
