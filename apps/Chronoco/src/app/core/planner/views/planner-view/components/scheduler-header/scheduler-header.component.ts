import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDownTray, heroArrowUpTray, heroShare } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-scheduler-header',
  templateUrl: './scheduler-header.component.html',
  styleUrl: './scheduler-header.component.css',
  imports: [
    NgIcon,
  ],
  viewProviders: [
    provideIcons({ heroArrowUpTray, heroArrowDownTray, heroShare }),
  ],
})
export class SchedulerHeaderComponent {

}
