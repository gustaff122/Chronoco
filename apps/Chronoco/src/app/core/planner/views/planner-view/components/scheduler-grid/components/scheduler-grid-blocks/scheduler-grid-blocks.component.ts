import { Component, computed, ElementRef, inject, OnInit, Signal, ViewChild } from '@angular/core';
import { SchedulerSelectingStore } from '../../stores/scheduler-selecting.store';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';
import { NgStyle } from '@angular/common';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { SchedulerBlocksStore } from '../../stores/scheduler-blocks/scheduler-blocks.store';
import { IRoom } from '@chronoco-fe/models/i-room';
import { IEventBlockPosition, IRenderableBlock } from '@chronoco-fe/models/i-event-block';

enum InteractionMode {
  None,
  Dragging,
  ResizingTop,
  ResizingBottom,
  ResizingLeft,
  ResizingRight,
  Creating
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
export class SchedulerGridBlocksComponent implements OnInit {
  public ngOnInit(): void {
    const item = this.blocksStore.createLegendDefinition('Wiedźmin 4', EventBlockType.LECTURE);
    this.blocksStore.selectLegendForDrawing(item.id);
  }

  @ViewChild('container', { static: true }) container!: ElementRef;

  private readonly schedulerSelectingStore = inject(SchedulerSelectingStore);
  private readonly gridStore = inject(SchedulerGridComponentStore);
  private readonly blocksStore = inject(SchedulerBlocksStore);

  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;

  private readonly gridSizeX = 144;
  private readonly gridSizeY = 15;
  private readonly edgeThreshold = 10;
  private readonly maxRow = 24 * 4;

  private mode: InteractionMode = InteractionMode.None;
  private activeInstanceId: string | null = null;

  private startMouseX = 0;
  private startMouseY = 0;
  private originalPosition: IEventBlockPosition | null = null;

  // Dostęp do danych ze store
  public readonly eventInstances = this.blocksStore.eventInstances;
  public readonly selectedLegend = this.blocksStore.selectedLegendBlock;

  public startSelectingHandler(event: MouseEvent) {
    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const clickedInstances = this.blocksStore.findEventInstancesAtPosition(
      mousePos.x,
      mousePos.y,
      this.gridSizeX,
      this.gridSizeY,
      this.rooms(),
      this.timeToIndex.bind(this),
    );

    const clickedInstance = clickedInstances[0];

    if (clickedInstance) {
      this.startInstanceInteraction(clickedInstance, mousePos, event);
    } else {
      this.createNewInstance(mousePos, event);
    }
  }

  public selectingHandler(event: MouseEvent) {
    if (this.mode === InteractionMode.None || !this.activeInstanceId || !this.originalPosition) return;

    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const deltaX = mousePos.x - this.startMouseX;
    const deltaY = mousePos.y - this.startMouseY;

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
    this.mode = InteractionMode.None;
    this.activeInstanceId = null;
    this.originalPosition = null;
  }

  private getMousePosition(event: MouseEvent): { x: number, y: number } | null {
    if (!this.container?.nativeElement) return null;

    const rect = this.container.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + this.container.nativeElement.scrollLeft,
      y: event.clientY - rect.top + this.container.nativeElement.scrollTop,
    };
  }

  private startInstanceInteraction(instance: IRenderableBlock, mousePos: { x: number, y: number }, event: MouseEvent) {
    this.activeInstanceId = instance.id;
    this.originalPosition = { ...instance.position };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;

    const style = this.blocksStore.getPositionStyle(
      instance.position,
      this.gridSizeX,
      this.gridSizeY,
      this.rooms(),
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
  }

  private createNewInstance(mousePos: { x: number, y: number }, event: MouseEvent) {
    // Sprawdź czy jest wybrana legenda
    const selectedLegend = this.selectedLegend();
    if (!selectedLegend) {
      console.warn('Nie wybrano typu eventu do rysowania');
      return;
    }

    const colIndex = Math.floor(mousePos.x / this.gridSizeX);
    const rowIndex = Math.floor(mousePos.y / this.gridSizeY);

    const rooms = this.rooms();
    if (colIndex < 0 || colIndex >= rooms.length) return;

    const newPosition: IEventBlockPosition = {
      rooms: [ rooms[colIndex].name ],
      startTime: this.indexToTime(rowIndex),
      endTime: this.indexToTime(rowIndex + 1),
    };

    const newInstance = this.blocksStore.createEventInstance(newPosition);
    if (!newInstance) {
      console.warn('Nie można utworzyć instancji eventu - prawdopodobnie konflikt');
      return;
    }

    this.activeInstanceId = newInstance.id;
    this.originalPosition = { ...newPosition };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;
    this.mode = InteractionMode.Creating;

    event.preventDefault();
  }

  private handleDragging(deltaX: number, deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    const deltaRows = Math.round(deltaY / this.gridSizeY);

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

    this.updateActiveInstance({
      rooms: selectedRooms,
      startTime: this.indexToTime(newStartRow),
      endTime: this.indexToTime(newEndRow),
    });
  }

  private handleResizeTop(deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / this.gridSizeY);
    const originalStartRow = this.timeToIndex(this.originalPosition.startTime);
    const originalEndRow = this.timeToIndex(this.originalPosition.endTime);

    let newStartRow = originalStartRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);

    if (newStartRow >= originalEndRow) {
      this.mode = InteractionMode.ResizingBottom;

      this.updateActiveInstance({
        startTime: this.originalPosition.endTime,
        endTime: this.indexToTime(Math.min(this.maxRow, newStartRow + 1)),
      });

      this.originalPosition = {
        ...this.originalPosition,
        startTime: this.originalPosition.endTime,
        endTime: this.indexToTime(newStartRow + 1),
      };
    } else {
      this.updateActiveInstance({
        startTime: this.indexToTime(newStartRow),
      });
    }
  }

  private handleResizeBottom(deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / this.gridSizeY);
    const originalStartRow = this.timeToIndex(this.originalPosition.startTime);
    const originalEndRow = this.timeToIndex(this.originalPosition.endTime);

    let newEndRow = originalEndRow + deltaRows;
    newEndRow = Math.min(this.maxRow, newEndRow);

    if (newEndRow <= originalStartRow) {
      this.mode = InteractionMode.ResizingTop;

      this.updateActiveInstance({
        startTime: this.indexToTime(Math.max(0, newEndRow - 1)),
        endTime: this.originalPosition.startTime,
      });

      this.originalPosition = {
        ...this.originalPosition,
        startTime: this.indexToTime(newEndRow - 1),
        endTime: this.originalPosition.startTime,
      };
    } else {
      this.updateActiveInstance({
        endTime: this.indexToTime(newEndRow),
      });
    }
  }

  private handleResizeLeft(deltaX: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const rooms = this.rooms();
    const originalRooms = this.originalPosition.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    let newLeftIdx = leftmostRoomIdx + deltaCols;

    newLeftIdx = Math.max(0, newLeftIdx);
    newLeftIdx = Math.min(rightmostRoomIdx, newLeftIdx);

    const selectedRooms = rooms.slice(newLeftIdx, rightmostRoomIdx + 1).map(r => r.name);

    this.updateActiveInstance({
      rooms: selectedRooms,
    });
  }

  private handleResizeRight(deltaX: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const rooms = this.rooms();
    const originalRooms = this.originalPosition.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    let newRightIdx = rightmostRoomIdx + deltaCols;

    newRightIdx = Math.min(rooms.length - 1, newRightIdx);
    newRightIdx = Math.max(leftmostRoomIdx, newRightIdx);

    const selectedRooms = rooms.slice(leftmostRoomIdx, newRightIdx + 1).map(r => r.name);

    this.updateActiveInstance({
      rooms: selectedRooms,
    });
  }

  private handleCreating(deltaX: number, deltaY: number) {
    if (!this.originalPosition || !this.activeInstanceId) return;

    const rooms = this.rooms();
    const originalColIndex = rooms.findIndex(r => r.name === this.originalPosition.rooms[0]);
    const originalRowIndex = this.timeToIndex(this.originalPosition.startTime);

    const deltaCol = Math.round(deltaX / this.gridSizeX);
    const deltaRow = Math.round(deltaY / this.gridSizeY);

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

    this.updateActiveInstance({
      rooms: selectedRooms,
      startTime: this.indexToTime(startRow),
      endTime: this.indexToTime(endRow),
    });
  }

  private updateActiveInstance(updates: Partial<IEventBlockPosition>) {
    if (!this.activeInstanceId) return;

    this.blocksStore.updateEventInstance(this.activeInstanceId, updates);
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
      const style = this.blocksStore.getPositionStyle(
        instance.position,
        this.gridSizeX,
        this.gridSizeY,
        this.rooms(),
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
          cursor: 'pointer',
        },
        instance: instance,
      };
    });
  });

  // Publiczne metody dla zewnętrznych komponentów
  public duplicateInstance(instanceId: string): boolean {
    return this.blocksStore.duplicateEventInstance(instanceId) !== null;
  }

  public deleteInstance(instanceId: string): boolean {
    return this.blocksStore.deleteEventInstance(instanceId);
  }

  public checkConflict(position: IEventBlockPosition, excludeInstanceId?: string): boolean {
    return this.blocksStore.hasConflict(position, excludeInstanceId);
  }
}