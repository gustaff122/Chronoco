import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IEventBlock } from '../../models/i-event-block';

@Injectable()
export class SchedulerBlocksStore {
  private readonly _blocks: WritableSignal<IEventBlock[]> = signal([]);
  public readonly blocks: Signal<IEventBlock[]> = signal([]);


}