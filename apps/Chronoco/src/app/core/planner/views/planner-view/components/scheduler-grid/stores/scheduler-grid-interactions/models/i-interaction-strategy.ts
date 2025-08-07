import { IInteractionContext } from './i-interaction-context';

export interface IInteractionStrategy {
  handle(
    deltaX: number,
    deltaY: number,
    context: IInteractionContext,
  ): void;
}