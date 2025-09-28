import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsCreatingStrategy implements IInteractionStrategy {
  public handle(deltaX: number, deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const rooms = ctx.gridStore.rooms();
    const originalCol = rooms.findIndex(r => r.name === ctx.originalPosition.rooms[0]);
    const originalRow = ctx.dateTimeToIndex(ctx.originalPosition.startTime);

    const deltaCol = Math.round(deltaX / ctx.gridStore.gridSizeX());
    const deltaRow = Math.round(deltaY / ctx.gridStore.gridSizeY());

    let startCol = originalCol;
    let endCol = originalCol + deltaCol;
    if (startCol > endCol) [ startCol, endCol ] = [ endCol, startCol ];

    startCol = Math.max(0, startCol);
    endCol = Math.min(rooms.length - 1, endCol);
    const selectedRooms = rooms.slice(startCol, endCol + 1).map(r => r.name);

    let startRow = originalRow;
    let endRow = originalRow + deltaRow;
    if (startRow > endRow) [ startRow, endRow ] = [ endRow, startRow ];

    const totalRows = ctx.getTotalRows();
    startRow = Math.max(0, startRow);
    endRow = Math.min(totalRows - 1, endRow);
    if (endRow <= startRow) endRow = startRow + 1;

    const newPosition = {
      rooms: selectedRooms,
      startTime: ctx.indexToDateTime(startRow),
      endTime: ctx.indexToDateTime(endRow),
    };

    ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
  }
}