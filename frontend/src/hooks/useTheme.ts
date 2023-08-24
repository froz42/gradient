import { useMemo } from "react";
import { useSettings } from "../providers/settings.provider";

export default function useTheme(baseClassName: string) {
  const { theme } = useSettings();
  const themeClassName = useMemo(() => {
    return `${baseClassName} ${theme}`;
  }, [baseClassName, theme]);
  return themeClassName;
}
