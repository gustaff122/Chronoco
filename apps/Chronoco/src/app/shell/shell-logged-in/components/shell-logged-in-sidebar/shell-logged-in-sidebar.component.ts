import { Component, signal, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IMenuItem } from '@chronoco-fe/models/i-menu-item';
import { MENU_ITEMS } from '@chronoco-fe/const/menu-items';
import { heroCalendar, heroHome } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-shell-logged-in-sidebar',
  imports: [
    NgIcon,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './shell-logged-in-sidebar.component.html',
  styleUrl: './shell-logged-in-sidebar.component.css',
  viewProviders: [ provideIcons({ heroCalendar, heroHome }) ],
})
export class ShellLoggedInSidebarComponent {
  public readonly navigation: Signal<IMenuItem[]> = signal(MENU_ITEMS).asReadonly();

}
