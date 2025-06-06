import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'lib-scheduler-header',
  imports: [
    NgIcon,
  ],
  templateUrl: './scheduler-header.component.html',
  styleUrl: './scheduler-header.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class SchedulerHeaderComponent {

}
