import { Injectable, signal, Signal } from '@angular/core';
import { IRoom } from '@chronoco-fe/models/i-room';

@Injectable()
export class SchedulerGridComponentStore {
  public rooms: Signal<IRoom[]> = signal([]);
  public timeFrom: Signal<string> = signal(null);
  public timeTo: Signal<string> = signal(null);
}