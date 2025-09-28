import { afterNextRender, Component, inject, Signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroArrowDownTray, heroArrowUpTray, heroShare } from '@ng-icons/heroicons/outline';
import { ButtonIconComponent } from '@chronoco-fe/ui/button-icon/button-icon.component';
import { RowSelectorComponent } from '@chronoco-fe/ui/row-selector/row-selector.component';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';
import { FormsModule } from '@angular/forms';
import { SchedulerGridDayScrollingStore } from '../../stores/scheduler-grid-day-scrolling.store';
import { SchedulerHeaderActiveUsersComponent } from './components/scheduler-header-active-users/scheduler-header-active-users.component';

@Component({
  selector: 'app-scheduler-header',
  templateUrl: './scheduler-header.component.html',
  styleUrl: './scheduler-header.component.css',
  imports: [
    ButtonIconComponent,
    RowSelectorComponent,
    FormsModule,
    SchedulerHeaderActiveUsersComponent,
  ],
  viewProviders: [
    provideIcons({ heroArrowUpTray, heroArrowDownTray, heroShare }),
  ],
})
export class SchedulerHeaderComponent {
  private readonly dayScrollingStore: SchedulerGridDayScrollingStore = inject(SchedulerGridDayScrollingStore);

  public selectedDay: Signal<ISelectOption> = this.dayScrollingStore.selectedDay;
  public readonly dayOptions: Signal<ISelectOption[]> = this.dayScrollingStore.daysOptions;

  constructor() {
    afterNextRender(() => this.dayScrollingStore.initScrollListener());
  }

  public onDateChange({ value }: ISelectOption): void {
    this.dayScrollingStore.scrollToDay(value);
  }
}
