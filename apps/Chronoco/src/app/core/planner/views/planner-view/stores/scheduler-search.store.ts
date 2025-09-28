import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable()
export class SchedulerSearchStore {
  private readonly _searchFilter: WritableSignal<string> = signal(null);
  public readonly searchFilter: Signal<string> = this._searchFilter.asReadonly();

  public search(phrase: string): void {
    this._searchFilter.set(phrase);
  }
}