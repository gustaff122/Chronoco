import { Component, signal, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { IMenuItem } from '@chronoco-fe/models/i-menu-item';
import { MENU_ITEMS } from '@chronoco-fe/const/menu-items';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { heroArrowRightStartOnRectangleSolid, heroCalendarSolid, heroFolderOpenSolid, heroHomeSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-shell-logged-in-sidebar',
  imports: [
    RouterLink,
    NgIcon,
    RouterLinkActive,
  ],
  templateUrl: './shell-logged-in-sidebar.component.html',
  styleUrl: './shell-logged-in-sidebar.component.css',
  viewProviders: [ provideIcons({ heroCalendarSolid, heroHomeSolid, heroUserGroupSolid, heroFolderOpenSolid, heroArrowRightStartOnRectangleSolid }) ],
})
export class ShellLoggedInSidebarComponent {
  public readonly navigation: Signal<IMenuItem[]> = signal(MENU_ITEMS).asReadonly();

}
