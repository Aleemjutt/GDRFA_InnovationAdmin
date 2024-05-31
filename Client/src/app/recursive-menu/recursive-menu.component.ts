import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface MenuItem {
  label: string;
  icon?: string;
  subMenuId?: string;
  subMenuItems?: MenuItem[];
  routerLink?: string;
}

@Component({
  selector: 'app-recursive-menu',
  templateUrl: './recursive-menu.component.html',
  styleUrls: ['./recursive-menu.component.css'],
})
export class RecursiveMenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() openMenu: MenuItem | null = null;
  @Output() menuToggled = new EventEmitter<MenuItem>();

  openSubMenus: { [key: string]: boolean } = {};

  toggleMenu(menuItem: MenuItem) {
    this.menuToggled.emit(menuItem);
    if (this.openMenu === menuItem) {
      this.openMenu = null;
      this.closeSubMenus();
    } else {
      this.openMenu = menuItem;
      this.closeSubMenus();
      if (menuItem.subMenuId) {
        this.openSubMenus[menuItem.subMenuId] = true;
      }
    }
  }

  closeSubMenus() {
    this.openSubMenus = {};
  }

  onMenuToggled(menuItem: MenuItem) {
    this.menuToggled.emit(menuItem);
  }
}
