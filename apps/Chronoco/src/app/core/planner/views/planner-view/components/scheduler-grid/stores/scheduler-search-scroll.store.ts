import { computed, DestroyRef, inject, Injectable, Injector, signal, Signal, WritableSignal } from '@angular/core';
import { SchedulerSearchStore } from './scheduler-search.store';
import { SchedulerEventInstancesStore } from './scheduler-event-instances.store';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerGridScrollStore } from './scheduler-grid-scroll.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class SchedulerSearchScrollStore {
  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);
  private readonly instancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly injector: Injector = inject(Injector);

  private readonly searchFilter: Signal<string> = this.searchStore.searchFilter;
  private readonly _currentFoundInstanceNumber: WritableSignal<number> = signal(0);
  public readonly currentFoundInstanceNumber: Signal<number> = this._currentFoundInstanceNumber.asReadonly();
  public readonly currentFoundInstance: Signal<IRenderableBlock> = computed(() => this.foundInstances()?.[this.currentFoundInstanceNumber() - 1] || null);

  constructor() {
    this.resetCurrentFoundInstanceOnSearch();
  }

  private readonly foundInstances: Signal<IRenderableBlock[]> = computed(() => {
    return this.instancesStore.eventInstances()
      .filter(block => block?.legend?.name?.toLowerCase().includes(this.searchFilter()?.toLowerCase()));
  });

  public readonly foundInstancesCount: Signal<number> = computed(() => this.foundInstances()?.length);

  public scrollToNextInstance(): void {
    if (this.currentFoundInstanceNumber() < this.foundInstancesCount()) {
      this._currentFoundInstanceNumber.update(state => state + 1);
    } else {
      this._currentFoundInstanceNumber.set(1);
    }

    this.scrollToInstance();
  }

  public scrollToPreviousInstance(): void {
    if (this.currentFoundInstanceNumber() > 1) {
      this._currentFoundInstanceNumber.update(state => state - 1);
    } else {
      this._currentFoundInstanceNumber.set(this.foundInstancesCount());
    }

    this.scrollToInstance();
  }

  private scrollToInstance(): void {
    const container = this.gridScrollStore.scrollContainer().nativeElement;
    const el = document.getElementById(`${this.currentFoundInstance()?.id}`);
    if (container && el) {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const offsetTop = rect.top - containerRect.top;
      const targetScrollTop = container.scrollTop + offsetTop - 130;
      const offsetLeft = rect.left - containerRect.left - 88;
      const targetScrollLeft = container.scrollLeft + offsetLeft;

      container.scrollTo({
        top: targetScrollTop,
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }

  private resetCurrentFoundInstanceOnSearch(): void {
    toObservable(this.searchFilter, { injector: this.injector }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this._currentFoundInstanceNumber.set(0));
  }
}