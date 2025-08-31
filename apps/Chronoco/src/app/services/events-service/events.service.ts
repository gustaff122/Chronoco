import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEvent } from './models/i-event';
import { ICreateEvent, IUpdateEvent } from './models/i-create-event';

@Injectable()
export class EventsService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  public create(event: ICreateEvent): Observable<IEvent> {
    return this.httpClient.post<IEvent>(`${this.API_URL}/events`, event);
  }

  public findAll(): Observable<IEvent[]> {
    return this.httpClient.get<IEvent[]>(`${this.API_URL}/events`);
  }

  public findOne(id: string): Observable<IEvent> {
    return this.httpClient.get<IEvent>(`${this.API_URL}/events/${id}`);
  }

  public update(id: string, event: IUpdateEvent): Observable<IEvent> {
    return this.httpClient.put<IEvent>(`${this.API_URL}/events/${id}`, event);
  }

  public remove(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/events/${id}`);
  }
}
