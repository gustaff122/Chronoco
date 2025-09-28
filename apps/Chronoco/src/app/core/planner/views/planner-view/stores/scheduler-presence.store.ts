import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable()
export class SchedulerPresenceStore {
  private readonly _presentUsers: WritableSignal<string[]> = signal([]);
  public readonly presentUsers: Signal<string[]> = this._presentUsers.asReadonly();

  public setPresentUsers(users: string[]): void {
    this._presentUsers.set(users);
  }

  public joinUser(user: string): void {
    this._presentUsers.update(state => [ ...state, user ]);
  }

  public leaveUser(user: string): void {
    this._presentUsers.update(state => state.filter(u => u !== user));
  }
}