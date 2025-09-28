import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { PlannersClientMessages, PlannersClientPayloads, PlannersSocketMessages } from '../models/planners-socket-messages';
import { environment } from '../../../../../../environments/environment';
import { SchedulerPresenceStore } from '../stores/scheduler-presence.store';

@Injectable()
export class PlannersSocketService {
  private socket: Socket = null;

  private readonly presenceStore: SchedulerPresenceStore = inject(SchedulerPresenceStore);

  public init(): void {
    this.socket = io(environment.SOCKET_PLANNER_URL, { withCredentials: true });
    this.sendMessage(PlannersClientMessages.JOIN_PLANNER, { planId: '1' });
    this.handleSocketMessages();
  }

  public sendMessage<K extends PlannersClientMessages>(message: K, data: PlannersClientPayloads[K]): void {
    this.socket.emit(message, data);
  }

  public handleSocketMessages(): void {
    this.socket.on(PlannersSocketMessages.PRESENCE_SNAPSHOT, (data: { users: string[] }) => this.presenceStore.setPresentUsers(data.users));
    this.socket.on(PlannersSocketMessages.USER_JOINED, (data: { username: string }) => this.presenceStore.joinUser(data.username));
    this.socket.on(PlannersSocketMessages.USER_LEFT, (data: { username: string }) => this.presenceStore.leaveUser(data.username));
  };
}