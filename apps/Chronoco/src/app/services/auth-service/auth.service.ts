import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser } from './models/i-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  public login(login: string, password: string): Observable<IUser> {
    return this.httpClient.post<IUser>(`${this.API_URL}/auth/login`, { login, password });
  }

  public getSelf(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.API_URL}/auth/self`);
  }

  public logout(): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/auth/logout`);
  }
}