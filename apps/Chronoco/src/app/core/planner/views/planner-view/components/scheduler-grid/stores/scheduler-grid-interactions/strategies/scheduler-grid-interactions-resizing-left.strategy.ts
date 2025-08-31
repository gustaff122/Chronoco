import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsResizingLeftStrategy implements IInteractionStrategy {
  public handle(deltaX: number, _deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const rooms = ctx.gridStore.rooms();
    const originalRooms = ctx.originalPosition.rooms;
    const leftmostIdx = Math.min(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));
    const rightmostIdx = Math.max(...originalRooms.map(r => rooms.findIndex(room => room.name === r)));

    const deltaCols = Math.round(deltaX / ctx.gridStore.gridSizeX());
    let newLeftIdx = leftmostIdx + deltaCols;

    newLeftIdx = Math.max(0, newLeftIdx);
    newLeftIdx = Math.min(rightmostIdx, newLeftIdx);

    const selectedRooms = rooms.slice(newLeftIdx, rightmostIdx + 1).map(r => r.name);
    ctx.instancesStore.update(ctx.activeInstanceId, { rooms: selectedRooms });
  }
}