import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsResizingRightStrategy implements IInteractionStrategy {
  public handle(deltaX: number, deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const rooms = ctx.gridStore.rooms();
    const originalRooms = ctx.originalPosition.rooms;
    const leftmostIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / ctx.gridStore.gridSizeX());
    let newRightIdx = rightmostIdx + deltaCols;

    newRightIdx = Math.min(rooms.length - 1, newRightIdx);
    newRightIdx = Math.max(leftmostIdx, newRightIdx);

    const selectedRooms = rooms.slice(leftmostIdx, newRightIdx + 1).map(r => r.name);
    ctx.eventInstancesStore.update(ctx.activeInstanceId, { rooms: selectedRooms });
  }
}
