import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { MenuItem, MenuItemButton } from "../providers/context-menu.provider";

export class MenuItemBuilder {
  private menuItem: MenuItemButton;

  public constructor(label: string) {
    this.menuItem = { type: "button", label };
  }

  public withIcon(icon: IconDefinition): MenuItemBuilder {
    this.menuItem.icon = icon;
    return this;
  }

  public withOnClick(onClick: () => void): MenuItemBuilder {
    this.menuItem.onClick = onClick;
    return this;
  }

  public build(): MenuItemButton {
    return this.menuItem;
  }
}

export class MenuBuilder {
  private menu: MenuItem[] = [];

  public addMenuItem(menuItem: MenuItem): MenuBuilder {
    this.menu.push(menuItem);
    return this;
  }

  public addDivider(): MenuBuilder {
    this.menu.push({ type: "divider" });
    return this;
  }

  public build(): MenuItem[] {
    return this.menu;
  }
}
