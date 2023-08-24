import { useCallback } from "react";
import useTheme from "../../../../hooks/use-theme";
import { Theme, useSettings } from "../../../../providers/settings.provider";
import ToggleSwitch from "../../../atoms/toggle-switch";
import "./style.scss";

export function SettingsPage() {
  const { theme, setTheme } = useSettings();
  const className = useTheme("settings-page");

  const handleOnChange = useCallback(
    (checked: boolean) => {
      setTheme(checked ? Theme.Dark : Theme.Light);
    },
    [setTheme]
  );
  return (
    <div className={className}>
      <h1>Settings</h1>
      <div className="option">
        <ToggleSwitch
          checked={theme === Theme.Dark}
          onChange={handleOnChange}
        />
        <p>Toggle dark mode</p>
      </div>
    </div>
  );
}
