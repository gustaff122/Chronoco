import { Component, computed, ElementRef, inject, OnDestroy, Signal, viewChild } from '@angular/core';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';
import { NgStyle } from '@angular/common';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '@chronoco-fe/models/i-room';
import { IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerEventInstancesStore } from '../../stores/scheduler-event-instances.store';
import { SchedulerGridScrollStore } from '../../stores/scheduler-grid-scroll.store';
import { SchedulerGridInteractionsStore } from '../../stores/scheduler-grid-interactions/scheduler-grid-interactions.store';


@Component({
  selector: 'app-scheduler-grid-blocks',
  templateUrl: './scheduler-grid-blocks.component.html',
  styleUrls: [ './scheduler-grid-blocks.component.css' ],
  imports: [
    NgStyle,
    SchedulerGridSingleBlockComponent,
  ],
})
export class SchedulerGridBlocksComponent implements OnDestroy {
  public interactionContainer: Signal<ElementRef> = viewChild('interactionContainer');

  private readonly gridStore = inject(SchedulerGridComponentStore);
  private readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  private readonly interactionsStore: SchedulerGridInteractionsStore = inject(SchedulerGridInteractionsStore);
  private readonly scrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);

  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;

  public readonly eventInstances: Signal<IRenderableBlock[]> = this.eventInstancesStore.eventInstances;

  public ngOnDestroy(): void {
    this.interactionsStore.cleanup();
  }

  public startSelectingHandler($event: MouseEvent): void {
    this.interactionsStore.startSelectingHandler($event);
  }

  public onBlockMouseMove($event: MouseEvent, block: {
    id: string;
    style: { top: string; height: string; left: string; width: string; position: string; userSelect: string; zIndex: number };
    instance: IRenderableBlock
  }): void {
    this.interactionsStore.onBlockMouseMove($event, block);
  }

  public onBlockMouseLeave($event: MouseEvent): void {
    this.interactionsStore.onBlockMouseLeave($event);
  }

  public stopScrollHandler(): void {
    this.scrollStore.stopAutoScroll();
  }

  constructor() {
    this.interactionsStore.interactionContainer = this.interactionContainer;
  }

  public readonly blockStyle = computed(() => {
    return this.eventInstances()?.map((instance) => {
      const style = this.eventInstancesStore.getPositionStyle(instance.position);

      return {
        id: instance.id,
        style: {
          top: `${style.top}px`,
          height: `${style.height}px`,
          left: `${style.left}px`,
          width: `${style.width}px`,
          position: 'absolute',
          userSelect: 'none',
          zIndex: 1,
        },
        instance: instance,
      };
    });
  });
}
