import { Component, computed, ElementRef, inject, Signal, signal, ViewChild } from '@angular/core';
import { SchedulerSelectingStore } from '../../stores/scheduler-selecting.store';
import { IEventBlock } from '../../../models/i-event-block';
import { SchedulerGridComponentStore } from '../../scheduler-grid.component.store';
import { IRoom } from '../../../models/i-room';
import { NgStyle } from '@angular/common';
import { SchedulerGridSingleBlockComponent } from './components/scheduler-grid-single-block/scheduler-grid-single-block.component';

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
  selector: 'lib-scheduler-grid-blocks',
  templateUrl: './scheduler-grid-blocks.component.html',
  styleUrls: [ './scheduler-grid-blocks.component.css' ],
  imports: [
    NgStyle,
    SchedulerGridSingleBlockComponent,
  ],
})
export class SchedulerGridBlocksComponent {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private readonly schedulerSelectingStore = inject(SchedulerSelectingStore);
  private readonly gridStore = inject(SchedulerGridComponentStore);

  public blocks = signal<IEventBlock[]>([]);
  public readonly rooms: Signal<IRoom[]> = this.gridStore.rooms;

  private readonly gridSizeX = 144;
  private readonly gridSizeY = 15;
  private readonly edgeThreshold = 10;
  private readonly maxRow = 24 * 4;

  private mode: InteractionMode = InteractionMode.None;
  private activeBlockId: number | null = null;
  private nextId = 1;

  private startMouseX = 0;
  private startMouseY = 0;
  private originalBlock: IEventBlock | null = null;

  public startSelectingHandler(event: MouseEvent) {
    const mousePos = this.getMousePosition(event);
    if (!mousePos) return;

    const clickedBlock = this.findBlockAtPosition(mousePos.x, mousePos.y);

    if (clickedBlock) {
      this.startBlockInteraction(clickedBlock, mousePos, event);
    } else {
      this.createNewBlock(mousePos, event);
    }
  }

  public selectingHandler(event: MouseEvent) {
    if (this.mode === InteractionMode.None || !this.activeBlockId || !this.originalBlock) return;

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
    this.activeBlockId = null;
    this.originalBlock = null;
  }

  private getMousePosition(event: MouseEvent): { x: number, y: number } | null {
    if (!this.container?.nativeElement) return null;

    const rect = this.container.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + this.container.nativeElement.scrollLeft,
      y: event.clientY - rect.top + this.container.nativeElement.scrollTop,
    };
  }

  private findBlockAtPosition(x: number, y: number): IEventBlock | null {
    return this.blocks().find(block => {
      const style = this.getBlockStyle(block);
      return (
        x >= style.left &&
        x <= style.left + style.width &&
        y >= style.top &&
        y <= style.top + style.height
      );
    }) || null;
  }

  private startBlockInteraction(block: IEventBlock, mousePos: { x: number, y: number }, event: MouseEvent) {
    this.activeBlockId = block.id;
    this.originalBlock = { ...block };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;

    const style = this.getBlockStyle(block);
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

  private createNewBlock(mousePos: { x: number, y: number }, event: MouseEvent) {
    const colIndex = Math.floor(mousePos.x / this.gridSizeX);
    const rowIndex = Math.floor(mousePos.y / this.gridSizeY);

    const rooms = this.rooms();
    if (colIndex < 0 || colIndex >= rooms.length) return;

    const newBlock: IEventBlock = {
      id: this.nextId++,
      rooms: [ rooms[colIndex].name ],
      startTime: this.indexToTime(rowIndex),
      endTime: this.indexToTime(rowIndex + 1),
      name: 'Nowy event',
    };

    this.blocks.set([ ...this.blocks(), newBlock ]);

    this.activeBlockId = newBlock.id;
    this.originalBlock = { ...newBlock };
    this.startMouseX = mousePos.x;
    this.startMouseY = mousePos.y;
    this.mode = InteractionMode.Creating;

    event.preventDefault();
  }

  private handleDragging(deltaX: number, deltaY: number) {
    if (!this.originalBlock) return;

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    const deltaRows = Math.round(deltaY / this.gridSizeY);

    const rooms = this.rooms();
    const startRoomIdx = rooms.findIndex(r => r.name === this.originalBlock.rooms[0]);
    const roomCount = this.originalBlock.rooms.length;

    let newStartRoomIdx = startRoomIdx + deltaCols;
    newStartRoomIdx = Math.max(0, newStartRoomIdx);
    newStartRoomIdx = Math.min(rooms.length - roomCount, newStartRoomIdx);

    const selectedRooms = rooms.slice(newStartRoomIdx, newStartRoomIdx + roomCount).map(r => r.name);

    const startRow = this.timeToIndex(this.originalBlock.startTime);
    const endRow = this.timeToIndex(this.originalBlock.endTime);
    const duration = endRow - startRow;

    let newStartRow = startRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);
    newStartRow = Math.min(this.maxRow - duration, newStartRow);

    const newEndRow = newStartRow + duration;

    this.updateActiveBlock({
      rooms: selectedRooms,
      startTime: this.indexToTime(newStartRow),
      endTime: this.indexToTime(newEndRow),
    });
  }

  private handleResizeTop(deltaY: number) {
    if (!this.originalBlock) return;

    const deltaRows = Math.round(deltaY / this.gridSizeY);
    const originalStartRow = this.timeToIndex(this.originalBlock.startTime);
    const originalEndRow = this.timeToIndex(this.originalBlock.endTime);

    let newStartRow = originalStartRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);

    if (newStartRow >= originalEndRow) {
      this.mode = InteractionMode.ResizingBottom;

      this.updateActiveBlock({
        startTime: this.originalBlock.endTime,
        endTime: this.indexToTime(Math.min(this.maxRow, newStartRow + 1)),
      });

      this.originalBlock = {
        ...this.originalBlock,
        startTime: this.originalBlock.endTime,
        endTime: this.indexToTime(newStartRow + 1),
      };
    } else {
      this.updateActiveBlock({
        startTime: this.indexToTime(newStartRow),
      });
    }
  }

  private handleResizeBottom(deltaY: number) {
    if (!this.originalBlock) return;

    const deltaRows = Math.round(deltaY / this.gridSizeY);
    const originalStartRow = this.timeToIndex(this.originalBlock.startTime);
    const originalEndRow = this.timeToIndex(this.originalBlock.endTime);

    let newEndRow = originalEndRow + deltaRows;
    newEndRow = Math.min(this.maxRow, newEndRow);

    if (newEndRow <= originalStartRow) {
      this.mode = InteractionMode.ResizingTop;

      this.updateActiveBlock({
        startTime: this.indexToTime(Math.max(0, newEndRow - 1)),
        endTime: this.originalBlock.startTime,
      });

      this.originalBlock = {
        ...this.originalBlock,
        startTime: this.indexToTime(newEndRow - 1),
        endTime: this.originalBlock.startTime,
      };
    } else {
      this.updateActiveBlock({
        endTime: this.indexToTime(newEndRow),
      });
    }
  }

  private handleResizeLeft(deltaX: number) {
    if (!this.originalBlock) return;

    const rooms = this.rooms();
    const originalRooms = this.originalBlock.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    let newLeftIdx = leftmostRoomIdx + deltaCols;

    newLeftIdx = Math.max(0, newLeftIdx);
    newLeftIdx = Math.min(rightmostRoomIdx, newLeftIdx);

    const selectedRooms = rooms.slice(newLeftIdx, rightmostRoomIdx + 1).map(r => r.name);

    this.updateActiveBlock({
      rooms: selectedRooms,
    });
  }

  private handleResizeRight(deltaX: number) {
    if (!this.originalBlock) return;

    const rooms = this.rooms();
    const originalRooms = this.originalBlock.rooms;
    const leftmostRoomIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostRoomIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / this.gridSizeX);
    let newRightIdx = rightmostRoomIdx + deltaCols;

    newRightIdx = Math.min(rooms.length - 1, newRightIdx);
    newRightIdx = Math.max(leftmostRoomIdx, newRightIdx);

    const selectedRooms = rooms.slice(leftmostRoomIdx, newRightIdx + 1).map(r => r.name);

    this.updateActiveBlock({
      rooms: selectedRooms,
    });
  }

  private handleCreating(deltaX: number, deltaY: number) {
    if (!this.originalBlock) return;

    const rooms = this.rooms();
    const originalColIndex = rooms.findIndex(r => r.name === this.originalBlock.rooms[0]);
    const originalRowIndex = this.timeToIndex(this.originalBlock.startTime);

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

    this.updateActiveBlock({
      rooms: selectedRooms,
      startTime: this.indexToTime(startRow),
      endTime: this.indexToTime(endRow),
    });
  }

  private getCurrentBlock(): IEventBlock | null {
    if (!this.activeBlockId) return null;
    return this.blocks().find(b => b.id === this.activeBlockId) || null;
  }

  private updateActiveBlock(updates: Partial<IEventBlock>) {
    if (!this.activeBlockId) return;

    const blocks = this.blocks();
    const idx = blocks.findIndex(b => b.id === this.activeBlockId);
    if (idx === -1) return;

    const updatedBlock = { ...blocks[idx], ...updates };
    blocks[idx] = updatedBlock;
    this.blocks.set([ ...blocks ]);
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

  public getBlockStyle(block: IEventBlock) {
    const top = this.timeToIndex(block.startTime) * this.gridSizeY;
    const height = (this.timeToIndex(block.endTime) - this.timeToIndex(block.startTime)) * this.gridSizeY;

    const roomIndexes = block.rooms
      .map((r) => this.rooms().findIndex(x => x.name === r))
      .filter(i => i !== -1);

    const left = Math.min(...roomIndexes) * this.gridSizeX;
    const width = roomIndexes.length * this.gridSizeX;

    return { top, height, left, width };
  }

  public readonly blockStyle = computed(() => {
    return this.blocks().map((block) => {
      const { top, height, left, width } = this.getBlockStyle(block);

      return {
        id: block.id,
        style: {
          top: `${top}px`,
          height: `${height}px`,
          left: `${left}px`,
          width: `${width}px`,
          position: 'absolute',
          userSelect: 'none',
          cursor: 'pointer',
        },
        block,
      };
    });
  });
}