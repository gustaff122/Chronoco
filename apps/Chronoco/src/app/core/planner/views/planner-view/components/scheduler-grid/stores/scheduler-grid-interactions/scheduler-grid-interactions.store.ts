import { ElementRef, inject, Injectable, Signal } from '@angular/core';
import { IEventBlockPosition, IOperationalBlock, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerEventInstancesStore } from '../scheduler-event-instances.store';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { SchedulerGridScrollStore } from '../scheduler-grid-scroll.store';
import { SchedulerLegendStore } from '../scheduler-legend.store';
import { InteractionMode } from './models/interaction-mode-enum';
import { IInteractionContext } from './models/i-interaction-context';
import { InteractionStrategyRegistry } from './scheduler-grid-interactions-strategies.registry';
import { SchedulerGridListenersStore } from '../scheduler-grid-listeners.store';

@Injectable()
export class SchedulerGridInteractionsStore implements IInteractionContext {
  public interactionContainer: Signal<ElementRef>;

  public readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  public readonly gridStore: SchedulerGridComponentStore = inject(SchedulerGridComponentStore);
  private readonly gridScrollStore: SchedulerGridScrollStore = inject(SchedulerGridScrollStore);
  private readonly listenersStore: SchedulerGridListenersStore = inject(SchedulerGridListenersStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly strategyRegistry: InteractionStrategyRegistry = new InteractionStrategyRegistry();

  private mode: InteractionMode = InteractionMode.NONE;
  public activeInstanceId: string = null;
  private readonly edgeThreshold = 10;

  public originalPosition: IEventBlockPosition = null;

  private startMouseX = 0;
  private startMouseY = 0;

  private getMousePosition(event: MouseEvent): { x: number, y: number } | null {
    const container = this.interactionContainer();
    if (!container) return null;

    const rect = container.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left + container.nativeElement.scrollLeft,
      y: event.clientY - rect.top + container.nativeElement.scrollTop,
    };
  }

  public onBlockMouseMove(event: MouseEvent, block: IOperationalBlock): void {
    if (this.mode !== InteractionMode.NONE) return;

    const cursor = this.getCursorType(event, block);
    (event.target as HTMLElement).style.cursor = cursor;
  }

  public onBlockMouseLeave(event: MouseEvent): void {
    if (this.mode !== InteractionMode.NONE) return;

    (event.target as HTMLElement).style.cursor = 'default';
  }

  private setOperationCursor(): void {
    const container = this.interactionContainer();
    if (!container) return;

    let cursor = 'default';

    switch (this.mode) {
      case InteractionMode.DRAGGING:
        cursor = 'move';
        break;
      case InteractionMode.RESIZING_TOP:
        cursor = 'n-resize';
        break;
      case InteractionMode.RESIZING_BOTTOM:
        cursor = 's-resize';
        break;
      case InteractionMode.RESIZING_LEFT:
        cursor = 'w-resize';
        break;
      case InteractionMode.RESIZING_RIGHT:
        cursor = 'e-resize';
        break;
    }

    container.nativeElement.style.cursor = cursor;
  }

  public getCursorType(event: MouseEvent, block: IOperationalBlock): string {
    const mousePos = this.getMousePosition(event);
    if (!mousePos) return 'default';

    const style = this.eventInstancesStore.getPositionStyle(block.instance.position);

    const distanceFromTop = mousePos.y - style.top;
    const distanceFromBottom = style.top + style.height - mousePos.y;
    const distanceFromLeft = mousePos.x - style.left;
    const distanceFromRight = style.left + style.width - mousePos.x;

    if (distanceFromTop < this.edgeThreshold) {
      return 'n-resize';
    }
    if (distanceFromBottom < this.edgeThreshold) {
      return 's-resize';
    }
    if (distanceFromLeft < this.edgeThreshold) {
      return 'w-resize';
    }
    if (distanceFromRight < this.edgeThreshold) {
      return 'e-resize';
    }

    return 'move';
  }

  public selectingHandler(event: MouseEvent) {
    if (this.mode === InteractionMode.NONE || !this.activeInstanceId) return;

    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const deltaX = mousePos.x - this.startMouseX;
    const deltaY = mousePos.y - this.startMouseY;

    this.gridScrollStore.updateAutoScroll(event.clientX, event.clientY);

    const strategy = this.strategyRegistry.get(this.mode);
    if (strategy && this.activeInstanceId && this.originalPosition) {
      strategy.handle(deltaX, deltaY, this);
    }
  }

  public stopSelectingHandler() {
    this.mode = InteractionMode.NONE;
    this.activeInstanceId = null;
    this.originalPosition = null;

    const container = this.interactionContainer();
    if (container) {
      container.nativeElement.style.cursor = 'default';
    }

    this.cleanup();
  }

  public cleanup(): void {
    this.listenersStore.detachDocumentListeners();
    this.gridScrollStore.stopAutoScroll();
  }

  private startInstanceInteraction(instance: IRenderableBlock, mousePos: { x: number, y: number }, event: MouseEvent) {
    this.activeInstanceId = instance.id;
    this.originalPosition = { ...instance.position };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;

    const style = this.eventInstancesStore.getPositionStyle(instance.position);
    this.eventInstancesStore.updateZIndexes(instance.id);

    const distanceFromTop = mousePos.y - style.top;
    const distanceFromBottom = style.top + style.height - mousePos.y;
    const distanceFromLeft = mousePos.x - style.left;
    const distanceFromRight = style.left + style.width - mousePos.x;

    if (distanceFromTop < this.edgeThreshold) {
      this.mode = InteractionMode.RESIZING_TOP;
    } else if (distanceFromBottom < this.edgeThreshold) {
      this.mode = InteractionMode.RESIZING_BOTTOM;
    } else if (distanceFromLeft < this.edgeThreshold) {
      this.mode = InteractionMode.RESIZING_LEFT;
    } else if (distanceFromRight < this.edgeThreshold) {
      this.mode = InteractionMode.RESIZING_RIGHT;
    } else {
      this.mode = InteractionMode.DRAGGING;
    }

    this.setOperationCursor();

    event.preventDefault();
    event.stopPropagation();
  }

  private createNewInstance(mousePos: { x: number, y: number }, event: MouseEvent) {
    const selectedLegend = this.legendStore.selectedLegendBlock();

    if (!selectedLegend) {
      return;
    }

    const colIndex = Math.floor(mousePos.x / this.gridStore.gridSizeX());
    const rowIndex = Math.floor(mousePos.y / this.gridStore.gridSizeY());

    const rooms = this.gridStore.rooms();
    if (colIndex < 0 || colIndex >= rooms.length) {
      return;
    }

    const startDate = this.indexToDateTime(rowIndex);
    const endDate = this.indexToDateTime(rowIndex + 1);

    const newPosition: Omit<IRenderableBlock, 'id' | 'zIndex'> = {
      position: {
        rooms: [ rooms[colIndex].name ],
        startTime: startDate,
        endTime: endDate,
      },
      legend: selectedLegend,
    };

    const newInstance = this.eventInstancesStore.create(newPosition);
    if (!newInstance) {
      return;
    }

    this.activeInstanceId = newInstance.id;
    this.originalPosition = { ...newPosition.position };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;
    this.mode = InteractionMode.CREATING;

    this.setOperationCursor();

    event.preventDefault();
    event.stopPropagation();
  }

  private updateActiveInstance(updates: Partial<IEventBlockPosition>) {
    if (!this.activeInstanceId) return;

    this.eventInstancesStore.update(this.activeInstanceId, updates);
  }

  public startSelectingHandler(event: MouseEvent) {
    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const clickedInstances = this.eventInstancesStore.findAtPosition(
      mousePos.x,
      mousePos.y,
    );

    const clickedInstance = clickedInstances[0];

    if (clickedInstance) {
      this.startInstanceInteraction(clickedInstance, mousePos, event);
    } else {
      this.createNewInstance(mousePos, event);
    }

    this.listenersStore.attachDocumentListeners(
      (e) => this.selectingHandler(e),
      () => this.stopSelectingHandler(),
    );
  }

  public indexToDateTime(index: number): Date {
    return this.gridStore.indexToDateTime(index);
  }

  public getTotalRows(): number {
    return this.gridStore.getTotalRows();
  }

  public dateTimeToIndex(dateTime: Date): number {
    return this.gridStore.dateTimeToIndex(dateTime);
  }
}