import { Injectable, signal, Signal } from '@angular/core';
import { IRoom } from '@chronoco-fe/models/i-room';

@Injectable()
export class SchedulerGridComponentStore {
  public rooms: Signal<IRoom[]>;
  public timeFrom: Signal<Date>;
  public timeTo: Signal<Date>;

  public readonly gridSizeY: Signal<number> = signal(15).asReadonly();
  public readonly gridSizeX: Signal<number> = signal(144).asReadonly();
  public readonly interval: Signal<number> = signal(15).asReadonly();

  public indexToDateTime(index: number): Date {
    const offsetMs = index * 15 * 60 * 1000;
    return new Date(this.timeFrom()?.getTime() + offsetMs);
  }

  public getTotalRows(): number {
    const diffMs = this.timeTo().getTime() - this.timeFrom().getTime();
    return Math.floor(diffMs / (15 * 60 * 1000));
  }

  public dateTimeToIndex(dateTime: Date): number {
    if (dateTime < this.timeFrom() || dateTime > this.timeTo()) {
      return 0;
    }

    const diffMs = dateTime?.getTime() - this.timeFrom()?.getTime();
    const quarterHours = Math.floor(diffMs / (15 * 60 * 1000));

    return quarterHours;
  }
}