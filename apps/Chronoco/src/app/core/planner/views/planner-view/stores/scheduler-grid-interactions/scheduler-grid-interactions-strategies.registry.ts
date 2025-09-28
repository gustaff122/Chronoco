import { IInteractionStrategy } from './models/i-interaction-strategy';
import { SchedulerGridInteractionsCreatingStrategy } from './strategies/scheduler-grid-interactions-creating.strategy';
import { InteractionMode } from './models/interaction-mode-enum';
import { SchedulerGridInteractionsDraggingStrategy } from './strategies/scheduler-grid-interactions-dragging.strategy';
import { SchedulerGridInteractionsResizingTopStrategy } from './strategies/scheduler-grid-interactions-resizing-top.strategy';
import { SchedulerGridInteractionsResizingBottomStrategy } from './strategies/scheduler-grid-interactions-resizing-bottom.strategy';
import { SchedulerGridInteractionsResizingLeftStrategy } from './strategies/scheduler-grid-interactions-resizing-left.strategy';
import { SchedulerGridInteractionsResizingRightStrategy } from './strategies/scheduler-grid-interactions-resizing-right.strategy';

export class InteractionStrategyRegistry {
  private readonly strategies: Map<InteractionMode, IInteractionStrategy> = new Map([
    [ InteractionMode.DRAGGING, new SchedulerGridInteractionsDraggingStrategy() ],
    [ InteractionMode.RESIZING_TOP, new SchedulerGridInteractionsResizingTopStrategy() ],
    [ InteractionMode.RESIZING_BOTTOM, new SchedulerGridInteractionsResizingBottomStrategy() ],
    [ InteractionMode.RESIZING_LEFT, new SchedulerGridInteractionsResizingLeftStrategy() ],
    [ InteractionMode.RESIZING_RIGHT, new SchedulerGridInteractionsResizingRightStrategy() ],
    [ InteractionMode.CREATING, new SchedulerGridInteractionsCreatingStrategy() ],
  ]);

  public get(mode: InteractionMode): IInteractionStrategy {
    return this.strategies.get(mode);
  }
}
