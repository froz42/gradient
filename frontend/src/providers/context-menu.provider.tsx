/* eslint-disable react-refresh/only-export-components */
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ContextMenuModal from "../components/context-menu-modal";

export interface MenuItemButton {
  type: "button";
  icon?: IconDefinition;
  label: string;
  onClick?: () => void;
}

export interface MenuItemDivider {
    type: "divider";
}

export type MenuItem = MenuItemButton | MenuItemDivider;

export interface Coordinates {
  x: number;
  y: number;
}

export interface ContextMenu {
  open: (coordinate: Coordinates, menuItems: MenuItem[]) => void;
}

export interface ContextMenuState {
  menuItems: MenuItem[];
  coordinates: Coordinates;
}

const ContextMenuContext = createContext<ContextMenu | undefined>(undefined);

const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
};

const ContextMenuProvider = ({ children }: { children?: ReactNode }) => {
  const [state, setState] = useState<ContextMenuState | undefined>();

  const open = useCallback(
    (coordinates: Coordinates, menuItems: MenuItem[]) => {
      setState({ coordinates, menuItems });
    },
    []
  );

  useEffect(() => {
    const handleClick = () => {
      setState(undefined);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <ContextMenuContext.Provider value={{ open }}>
      <ContextMenuModal contextMenuState={state} />
      {children}
    </ContextMenuContext.Provider>
  );
};

export { ContextMenuProvider, useContextMenu };
