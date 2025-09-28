import { Component, computed, inject, Signal } from '@angular/core';
import { SchedulerPresenceStore } from '../../../../stores/scheduler-presence.store';
import { SchedulerHeaderActiveUsersItemComponent } from '../scheduler-header-active-users-item/scheduler-header-active-users-item.component';

@Component({
  selector: 'app-scheduler-header-active-users',
  imports: [
    SchedulerHeaderActiveUsersItemComponent,

  ],
  templateUrl: './scheduler-header-active-users.component.html',
  styleUrl: './scheduler-header-active-users.component.css',
})
export class SchedulerHeaderActiveUsersComponent {
  private readonly presenceStore: SchedulerPresenceStore = inject(SchedulerPresenceStore);

  public readonly presentUsers: Signal<string[]> = computed(() => {
    const users = this.presenceStore.presentUsers();
    return users.length > 2 ? users.slice(0, 2) : users;
  });

  public readonly moreUsersAmount: Signal<number> = computed(() => this.presenceStore.presentUsers().length - 2);
}
