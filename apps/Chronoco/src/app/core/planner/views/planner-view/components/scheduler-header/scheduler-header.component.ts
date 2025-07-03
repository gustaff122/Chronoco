import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroArrowDownTray, heroArrowUpTray, heroShare } from '@ng-icons/heroicons/outline';
import { ButtonIconComponent } from '@chronoco-fe/ui/button-icon/button-icon.component';

@Component({
  selector: 'app-scheduler-header',
  templateUrl: './scheduler-header.component.html',
  styleUrl: './scheduler-header.component.css',
  imports: [
    ButtonIconComponent,
  ],
  viewProviders: [
    provideIcons({ heroArrowUpTray, heroArrowDownTray, heroShare }),
  ],
})
export class SchedulerHeaderComponent {

}
