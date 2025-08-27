import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { SchedulerGridComponentStore } from '../scheduler-grid.component.store';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';
import { SchedulerGridScrollStore } from './scheduler-grid-scroll.store';
import { fromEvent, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class SchedulerGridDayScrollingStore {
  private readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly _selectedDay: WritableSignal<ISelectOption> = signal(null);
  public readonly selectedDay: Signal<ISelectOption> = this._selectedDay.asReadonly();

  public initScrollListener(): void {
    const container = this.gridScrollStore.scrollContainer().nativeElement;

    fromEvent(container, 'scroll', { passive: true })
      .pipe(
        startWith(this.getCurrentDayByScroll()),
        map(() => this.getCurrentDayByScroll()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(active => {
        this._selectedDay.set(active);
      });
  }

  public scrollToDay(value: string): void {
    const container = this.gridScrollStore.scrollContainer().nativeElement;
    const el = document.getElementById(`time-${value}`);
    if (container && el) {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const offset = rect.top - containerRect.top;
      const targetScrollTop = container.scrollTop + offset - 130;

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }

  private getCurrentDayByScroll(): ISelectOption {
    const container = this.gridScrollStore.scrollContainer().nativeElement;

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[id^="time-"]'));
    const containerRect = container.getBoundingClientRect();

    const dayVisibilityMap = new Map<string, number>();

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > 0) {
        const day = el.id.split('T')[0].replace('time-', '');
        dayVisibilityMap.set(day, (dayVisibilityMap.get(day) || 0) + visibleHeight);
      }
    }

    let activeDay: string | null = null;
    let maxVisible = 0;
    for (const [ day, visible ] of dayVisibilityMap) {
      if (visible > maxVisible) {
        maxVisible = visible;
        activeDay = day;
      }
    }

    if (!activeDay) return null;
    return this.daysOptions().find(opt => opt.value.startsWith(activeDay)) || null;
  }


  public readonly daysOptions: Signal<ISelectOption[]> = computed(() => {
    const from = this.gridStore.timeFrom();
    const to = this.gridStore.timeTo();

    if (!from || !to) return [];

    let days = this.days();

    if (to.getHours() === 0 && to.getMinutes() === 0 && to.getSeconds() === 0) {
      days = days.slice(0, -1);
    }

    return days?.map((day, index) => {
      const weekday = day.toLocaleDateString('pl-PL', { weekday: 'long' });

      const date = new Date(day);
      let value: string;

      if (index === 0) {
        value = from.toLocaleString('sv-SE').replace(' ', 'T');
      } else {
        value = new Date(date.setHours(0, 0, 0, 0)).toLocaleString('sv-SE').replace(' ', 'T');
      }

      return {
        value,
        display: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      };
    });
  });

  private readonly days: Signal<Date[]> = computed(() => {
    if (!this.gridStore.timeFrom() || !this.gridStore.timeTo()) return [];

    const days: Date[] = [];
    const current = new Date(this.gridStore.timeFrom());

    while (current <= this.gridStore.timeTo()) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  });
}