import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDown } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-shell-logged-in-header-event',
  imports: [
    NgIcon,
  ],
  templateUrl: './shell-logged-in-header-event.component.html',
  styleUrl: './shell-logged-in-header-event.component.css',
  viewProviders: [
    provideIcons({ heroChevronDown }),
  ],
})
export class ShellLoggedInHeaderEventComponent {

}
