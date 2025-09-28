import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsDraggingStrategy implements IInteractionStrategy {
  public handle(deltaX: number, deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const deltaCols = Math.round(deltaX / ctx.gridStore.gridSizeX());
    const deltaRows = Math.round(deltaY / ctx.gridStore.gridSizeY());

    const rooms = ctx.gridStore.rooms();
    const startRoomIdx = rooms.findIndex(r => r.name === ctx.originalPosition.rooms[0]);
    const roomCount = ctx.originalPosition.rooms.length;

    let newStartRoomIdx = startRoomIdx + deltaCols;
    newStartRoomIdx = Math.max(0, newStartRoomIdx);
    newStartRoomIdx = Math.min(rooms.length - roomCount, newStartRoomIdx);

    const selectedRooms = rooms.slice(newStartRoomIdx, newStartRoomIdx + roomCount).map(r => r.name);

    const startRow = ctx.dateTimeToIndex(ctx.originalPosition.startTime);
    const endRow = ctx.dateTimeToIndex(ctx.originalPosition.endTime);
    const duration = endRow - startRow;

    const totalRows = ctx.getTotalRows();
    let newStartRow = startRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);
    newStartRow = Math.min(totalRows - duration, newStartRow);

    const newEndRow = newStartRow + duration;

    const newPosition = {
      rooms: selectedRooms,
      startTime: ctx.indexToDateTime(newStartRow),
      endTime: ctx.indexToDateTime(newEndRow),
    };

    ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
  }
}
