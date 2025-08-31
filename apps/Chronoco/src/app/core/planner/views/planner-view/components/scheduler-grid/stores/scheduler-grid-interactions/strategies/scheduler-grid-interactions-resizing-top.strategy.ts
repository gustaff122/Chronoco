import { IInteractionStrategy } from '../models/i-interaction-strategy';
import { IInteractionContext } from '../models/i-interaction-context';

export class SchedulerGridInteractionsResizingTopStrategy implements IInteractionStrategy {
  public handle(_deltaX: number, deltaY: number, ctx: IInteractionContext): void {
    if (!ctx.originalPosition || !ctx.activeInstanceId) return;

    const deltaRows = Math.round(deltaY / ctx.gridStore.gridSizeY());
    const originalStartRow = ctx.dateTimeToIndex(ctx.originalPosition.startTime);
    const originalEndRow = ctx.dateTimeToIndex(ctx.originalPosition.endTime);

    let newStartRow = originalStartRow + deltaRows;
    newStartRow = Math.max(0, newStartRow);

    if (newStartRow >= originalEndRow) {
      const totalRows = ctx.getTotalRows();
      const newPosition = {
        startTime: ctx.originalPosition.endTime,
        endTime: ctx.indexToDateTime(Math.min(totalRows, newStartRow + 1)),
      };

      ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
    } else {
      const newPosition = {
        startTime: ctx.indexToDateTime(newStartRow),
      };

      ctx.instancesStore.update(ctx.activeInstanceId, newPosition);
    }
  }
}