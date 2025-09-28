import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsResizingBottomStrategy implements IInteractionStrategy {
  public handle(_deltaX: number, deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / ctx.gridStore.gridSizeY());
    const originalStartRow = ctx.dateTimeToIndex(ctx.originalPosition.startTime);
    const originalEndRow = ctx.dateTimeToIndex(ctx.originalPosition.endTime);

    const totalRows = ctx.getTotalRows();
    let newEndRow = originalEndRow + deltaRows;
    newEndRow = Math.min(totalRows, newEndRow);

    if (newEndRow <= originalStartRow) {
      const newPosition = {
        startTime: ctx.indexToDateTime(Math.max(0, newEndRow - 1)),
        endTime: ctx.originalPosition.startTime,
      };

      if (this.hasNoDuration(newPosition.startTime, newPosition.endTime)) return;

      ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
    } else {
      const newPosition = {
        endTime: ctx.indexToDateTime(newEndRow),
      };

      ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
    }
  }

  private hasNoDuration(startTime: Date, endTime: Date): boolean {
    return startTime.toISOString() === endTime.toISOString();
  }
}