import { useMemo } from "react";
import "./style.scss";
import useTheme from "../../../hooks/use-theme";

type LoadingPlaceholder = {
  className?: string;
};

export default function LoadingPlaceholder({ className }: LoadingPlaceholder) {
  const classNameTheme = useTheme("loading-placeholder");
  const divClassName = useMemo(() => {
    if (!className) {
      return classNameTheme;
    }
    return `${classNameTheme} ${className}`;
  }, [className, classNameTheme]);
  return <div className={divClassName}></div>;
}
