import { Component, computed, ElementRef, inject, OnDestroy, Signal, viewChild } from '@angular/core';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';
import { NgStyle } from '@angular/common';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '@chronoco-fe/models/i-room';
import { IEventBlock, IEventBlockPosition, IRenderableBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerEventInstancesStore } from '../../stores/scheduler-event-instances.store';
import { SchedulerLegendStore } from '../../stores/scheduler-legend.store';

enum InteractionMode {
  None,
  Dragging,
  ResizingTop,
  ResizingBottom,
  ResizingLeft,
  ResizingRight,
  Creating
}

interface AutoScrollConfig {
  margin: number;
  speed: number;
  intervalMs: number;
}

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
  public container: Signal<ElementRef> = viewChild('container');

  private readonly gridStore = inject(SchedulerGridComponentStore);
  private readonly eventInstancesStore: SchedulerEventInstancesStore = inject(SchedulerEventInstancesStore);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);

  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;

  private readonly edgeThreshold = 10;
  private readonly maxRow = 24 * 4;

  private readonly autoScrollConfig: AutoScrollConfig = {
    margin: 50,
    speed: 15,
    intervalMs: 16,
  };

  private mode: InteractionMode = InteractionMode.None;
  private activeInstanceId: string | null = null;

  private startMouseX = 0;
  private startMouseY = 0;
  private originalPosition: IEventBlockPosition | null = null;
  private hasCollision = false;

  private documentMouseMoveListener?: (event: MouseEvent) => void;
  private documentMouseUpListener?: (event: MouseEvent) => void;

  private autoScrollIntervalId: number | null = null;
  private currentScrollDirection = { x: 0, y: 0 };
  private scrollContainer: HTMLElement | null = null;

  public readonly eventInstances: Signal<IRenderableBlock[]> = this.eventInstancesStore.eventInstances;
  public readonly selectedLegend: Signal<IEventBlock | null> = this.legendStore.selectedLegendBlock;

  public ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    this.detachDocumentListeners();
    this.stopAutoScroll();
  }

  public startSelectingHandler(event: MouseEvent) {
    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const clickedInstances = this.eventInstancesStore.findAtPosition(
      mousePos.x,
      mousePos.y,
      this.timeToIndex.bind(this),
    );

    const clickedInstance = clickedInstances[0];

    if (clickedInstance) {
      this.startInstanceInteraction(clickedInstance, mousePos, event);
    } else {
      this.createNewInstance(mousePos, event);
    }

    this.initializeScrollContainer();
    this.attachDocumentListeners();
  }

  private initializeScrollContainer() {
    this.scrollContainer = document.querySelector('.scheduler-grid') as HTMLElement;
    if (!this.scrollContainer) {
      console.warn('Scroll container .scheduler-grid not found');
      const container = this.container();
      if (container) {
        this.scrollContainer = container.nativeElement;
      }
    }
  }

  private attachDocumentListeners(): void {
    this.detachDocumentListeners();

    this.documentMouseMoveListener = (event: MouseEvent) => {
      this.selectingHandler(event);
    };

    this.documentMouseUpListener = () => {
      this.stopSelectingHandler();
    };

    document.addEventListener('mousemove', this.documentMouseMoveListener);
    document.addEventListener('mouseup', this.documentMouseUpListener);
  }

  private detachDocumentListeners() {
    if (this.documentMouseMoveListener) {
      document.removeEventListener('mousemove', this.documentMouseMoveListener);
      this.documentMouseMoveListener = undefined;
    }

    if (this.documentMouseUpListener) {
      document.removeEventListener('mouseup', this.documentMouseUpListener);
      this.documentMouseUpListener = undefined;
    }
  }

  // Improved autoscroll implementation
  private updateAutoScroll(clientX: number, clientY: number) {
    if (!this.scrollContainer) {
      return;
    }

    const rect = this.scrollContainer.getBoundingClientRect();
    const { margin } = this.autoScrollConfig;

    let scrollX = 0;
    let scrollY = 0;

    const distanceFromLeft = clientX - rect.left;
    const distanceFromRight = rect.right - clientX;

    if (distanceFromLeft < margin && distanceFromLeft >= 0) {
      scrollX = -this.autoScrollConfig.speed * (1 - distanceFromLeft / margin);
    } else if (distanceFromRight < margin && distanceFromRight >= 0) {
      scrollX = this.autoScrollConfig.speed * (1 - distanceFromRight / margin);
    } else if (clientX < rect.left) {
      scrollX = -this.autoScrollConfig.speed;
    } else if (clientX > rect.right) {
      scrollX = this.autoScrollConfig.speed;
    }

    const distanceFromTop = clientY - rect.top;
    const distanceFromBottom = rect.bottom - clientY;

    if (distanceFromTop < margin && distanceFromTop >= 0) {
      scrollY = -this.autoScrollConfig.speed * (1 - distanceFromTop / margin);
    } else if (distanceFromBottom < margin && distanceFromBottom >= 0) {
      scrollY = this.autoScrollConfig.speed * (1 - distanceFromBottom / margin);
    } else if (clientY < rect.top) {
      scrollY = -this.autoScrollConfig.speed;
    } else if (clientY > rect.bottom) {
      scrollY = this.autoScrollConfig.speed;
    }

    this.setScrollDirection(scrollX, scrollY);
  }

  private setScrollDirection(x: number, y: number) {
    const newDirection = { x: Math.round(x), y: Math.round(y) };

    if (newDirection.x !== this.currentScrollDirection.x ||
      newDirection.y !== this.currentScrollDirection.y) {

      this.currentScrollDirection = newDirection;

      if (newDirection.x === 0 && newDirection.y === 0) {
        this.stopAutoScroll();
      } else {
        this.startAutoScroll();
      }
    }
  }

  private startAutoScroll() {
    if (this.autoScrollIntervalId !== null) {
      return;
    }

    this.autoScrollIntervalId = window.setInterval(() => {
      if (!this.scrollContainer) {
        this.stopAutoScroll();
        return;
      }

      if (this.currentScrollDirection.x !== 0 || this.currentScrollDirection.y !== 0) {
        this.scrollContainer.scrollBy(
          this.currentScrollDirection.x,
          this.currentScrollDirection.y,
        );
      }
    }, this.autoScrollConfig.intervalMs);
  }

  public stopAutoScroll() {
    if (this.autoScrollIntervalId !== null) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = null;
    }
    this.currentScrollDirection = { x: 0, y: 0 };
  }

  public selectingHandler(event: MouseEvent) {
    if (this.mode === InteractionMode.None || !this.activeInstanceId) return;

    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const deltaX = mousePos.x - this.startMouseX;
    const deltaY = mousePos.y - this.startMouseY;

    this.updateAutoScroll(event.clientX, event.clientY);

    switch (this.mode) {
      case InteractionMode.Dragging:
        this.handleDragging(deltaX, deltaY);
        break;
      case InteractionMode.ResizingTop:
        this.handleResizeTop(deltaY);
        break;
      case InteractionMode.ResizingBottom:
        this.handleResizeBottom(deltaY);
        break;
      case InteractionMode.ResizingLeft:
        this.handleResizeLeft(deltaX);
        break;
      case InteractionMode.ResizingRight:
        this.handleResizeRight(deltaX);
        break;
      case InteractionMode.Creating:
        this.handleCreating(deltaX, deltaY);
        break;
    }
  }

  public stopSelectingHandler() {
    if (this.hasCollision && this.originalPosition && this.activeInstanceId) {

      if (this.mode === InteractionMode.Creating) {
        this.eventInstancesStore.delete(this.activeInstanceId);
      } else {
        this.updateActiveInstance(this.originalPosition);
      }
    }

    this.mode = InteractionMode.None;
    this.activeInstanceId = null;
    this.originalPosition = null;
    this.hasCollision = false;

    this.cleanup();
  }

  private getMousePosition(event: MouseEvent): { x: number, y: number } | null {
    const container = this.container();
    if (!container) return null;

    const rect = container.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left + container.nativeElement.scrollLeft,
      y: event.clientY - rect.top + container.nativeElement.scrollTop,
    };
  }

  private startInstanceInteraction(instance: IRenderableBlock, mousePos: { x: number, y: number }, event: MouseEvent) {
    this.activeInstanceId = instance.id;
    this.originalPosition = { ...instance.position };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;

    const style = this.eventInstancesStore.getPositionStyle(
      instance.position,
      this.timeToIndex.bind(this),
    );

    const distanceFromTop = mousePos.y - style.top;
    const distanceFromBottom = style.top + style.height - mousePos.y;
    const distanceFromLeft = mousePos.x - style.left;
    const distanceFromRight = style.left + style.width - mousePos.x;

    if (distanceFromTop < this.edgeThreshold) {
      this.mode = InteractionMode.ResizingTop;
    } else if (distanceFromBottom < this.edgeThreshold) {
      this.mode = InteractionMode.ResizingBottom;
    } else if (distanceFromLeft < this.edgeThreshold) {
      this.mode = InteractionMode.ResizingLeft;
    } else if (distanceFromRight < this.edgeThreshold) {
      this.mode = InteractionMode.ResizingRight;
    } else {
      this.mode = InteractionMode.Dragging;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private createNewInstance(mousePos: { x: number, y: number }, event: MouseEvent) {
    const selectedLegend = this.selectedLegend();

    if (!selectedLegend) {
      return;
    }

    const colIndex = Math.floor(mousePos.x / this.gridStore.gridSizeX());
    const rowIndex = Math.floor(mousePos.y / this.gridStore.gridSizeY());

    const rooms = this.rooms();
    if (colIndex < 0 || colIndex >= rooms.length) {
      console.warn('Column index out of bounds:', colIndex);
      return;
    }

    const newPosition: Omit<IRenderableBlock, 'id' | 'positionIndex'> = {
      legendId: selectedLegend.id,
      position: {
        rooms: [ rooms[colIndex].name ],
        startTime: this.indexToTime(rowIndex),
        endTime: this.indexToTime(rowIndex + 1),
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
    this.mode = InteractionMode.Creating;

    event.preventDefault();
    event.stopPropagation();
  }

  private handleDragging(deltaX: number, deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaCols = Math.round(deltaX / this.gridStore.gridSizeX());
    const deltaRows = Math.round(deltaY / this.gridStore.gridSizeY());

    const rooms = this.rooms();
    const startRoomIdx = rooms.findIndex(r => r.name === this.originalPosition.rooms[0]);
    const roomCount = this.originalPosition.rooms.length;

    let newStartRoomIdx = startRoomIdx + deltaCols;
    newStartRoomIdx = Math.max(0, newStartRoomIdx);
    newStartRoomIdx = Math.min(rooms.length - roomCount, newStartRoomIdx);

    const selectedRooms = rooms.slice(newStartRoomIdx, newStartRoomIdx + roomCount).map(r => r.name);

    const startRow = this.timeToIndex(this.originalPosition.startTime);
    const endRow = this.timeToIndex(this.originalPosition.endTime);
    const duration = endRow - startRow;

    let newStartRow = startRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);
    newStartRow = Math.min(this.maxRow - duration, newStartRow);

    const newEndRow = newStartRow + duration;

    const newPosition = {
      rooms: selectedRooms,
      startTime: this.indexToTime(newStartRow),
      endTime: this.indexToTime(newEndRow),
    };

    this.updateActiveInstance(newPosition);
  }

  private handleResizeTop(deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / this.gridStore.gridSizeY());
    const originalStartRow = this.timeToIndex(this.originalPosition.startTime);
    const originalEndRow = this.timeToIndex(this.originalPosition.endTime);

    let newStartRow = originalStartRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);

    if (newStartRow >= originalEndRow) {
      this.mode = InteractionMode.ResizingBottom;

      const newPosition = {
        startTime: this.originalPosition.endTime,
        endTime: this.indexToTime(Math.min(this.maxRow, newStartRow + 1)),
      };

      this.updateActiveInstance(newPosition);

      this.originalPosition = {
        ...this.originalPosition,
        startTime: this.originalPosition.endTime,
        endTime: this.indexToTime(newStartRow + 1),
      };
    } else {
      const newPosition = {
        startTime: this.indexToTime(newStartRow),
      };

      this.updateActiveInstance(newPosition);
    }
  }

  private handleResizeBottom(deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / this.gridStore.gridSizeY());
    const originalStartRow = this.timeToIndex(this.originalPosition.startTime);
    const originalEndRow = this.timeToIndex(this.originalPosition.endTime);

    let newEndRow = originalEndRow + deltaRows;
    newEndRow = Math.min(this.maxRow, newEndRow);

    if (newEndRow <= originalStartRow) {
      this.mode = InteractionMode.ResizingTop;

      const newPosition = {
        startTime: this.indexToTime(Math.max(0, newEndRow - 1)),
        endTime: this.originalPosition.startTime,
      };

      this.updateActiveInstance(newPosition);

      this.originalPosition = {
        ...this.originalPosition,
        startTime: this.indexToTime(newEndRow - 1),
        endTime: this.originalPosition.startTime,
      };
    } else {
      const newPosition = {
        endTime: this.indexToTime(newEndRow),
      };

      this.updateActiveInstance(newPosition);
    }
  }

  private handleResizeLeft(deltaX: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const rooms = this.rooms();
    const originalRooms = this.originalPosition.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridStore.gridSizeX());
    let newLeftIdx = leftmostRoomIdx + deltaCols;

    newLeftIdx = Math.max(0, newLeftIdx);
    newLeftIdx = Math.min(rightmostRoomIdx, newLeftIdx);

    const selectedRooms = rooms.slice(newLeftIdx, rightmostRoomIdx + 1).map(r => r.name);

    const newPosition = {
      rooms: selectedRooms,
    };

    this.updateActiveInstance(newPosition);
  }

  private handleResizeRight(deltaX: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const rooms = this.rooms();
    const originalRooms = this.originalPosition.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridStore.gridSizeX());
    let newRightIdx = rightmostRoomIdx + deltaCols;

    newRightIdx = Math.min(rooms.length - 1, newRightIdx);
    newRightIdx = Math.max(leftmostRoomIdx, newRightIdx);

    const selectedRooms = rooms.slice(leftmostRoomIdx, newRightIdx + 1).map(r => r.name);

    const newPosition = {
      rooms: selectedRooms,
    };

    this.updateActiveInstance(newPosition);
  }

  private handleCreating(deltaX: number, deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;


    const rooms = this.rooms();
    const originalColIndex = rooms.findIndex(r => r.name === this.originalPosition.rooms[0]);
    const originalRowIndex = this.timeToIndex(this.originalPosition.startTime);

    const deltaCol = Math.round(deltaX / this.gridStore.gridSizeX());
    const deltaRow = Math.round(deltaY / this.gridStore.gridSizeY());

    let startCol = originalColIndex;
    let endCol = originalColIndex + deltaCol;

    if (startCol > endCol) {
      [ startCol, endCol ] = [ endCol, startCol ];
    }

    startCol = Math.max(0, startCol);
    endCol = Math.min(rooms.length - 1, endCol);

    const selectedRooms = rooms.slice(startCol, endCol + 1).map(r => r.name);

    let startRow = originalRowIndex;
    let endRow = originalRowIndex + deltaRow;

    if (startRow > endRow) {
      [ startRow, endRow ] = [ endRow, startRow ];
    }

    startRow = Math.max(0, startRow);
    endRow = Math.min(this.maxRow - 1, endRow);

    if (endRow <= startRow) {
      endRow = startRow + 1;
    }

    const newPosition = {
      rooms: selectedRooms,
      startTime: this.indexToTime(startRow),
      endTime: this.indexToTime(endRow),
    };

    this.updateActiveInstance(newPosition);
  }

  private updateActiveInstance(updates: Partial<IEventBlockPosition>) {
    if (!this.activeInstanceId) return;

    this.eventInstancesStore.update(this.activeInstanceId, updates);
  }

  private timeToIndex(time: string): number {
    const [ h, m ] = time.split(':').map(Number);
    return h * 4 + Math.floor(m / 15);
  }

  private indexToTime(index: number): string {
    const h = Math.floor(index / 4);
    const m = (index % 4) * 15;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  public readonly blockStyle = computed(() => {
    return this.eventInstances().map((instance) => {
      const style = this.eventInstancesStore.getPositionStyle(
        instance.position,
        this.timeToIndex.bind(this),
      );

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