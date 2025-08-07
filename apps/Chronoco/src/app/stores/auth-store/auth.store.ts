import { computed, inject, Injectable, Signal, signal, TransferState, WritableSignal } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { IUser } from '../../services/auth-service/models/i-user';
import { catchError, finalize, lastValueFrom, of, tap } from 'rxjs';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';
import { Router } from '@angular/router';

interface IAuthState {
  user: IUser;
  loading: boolean;
}

const DEFAULT_STATE: IAuthState = {
  user: null,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly transferState: TransferState = inject(TransferState);

  private readonly state: WritableSignal<IAuthState> = signal(DEFAULT_STATE);

  public readonly user: Signal<IUser> = computed(() => this.state()?.user);
  public readonly isLoggedIn: Signal<boolean> = computed(() => this.state()?.user !== null);

  public init(): Promise<IUser> {
    return this.getUserInfo();
  }

  public login(login: string, password: string): void {
    this.state.update(state => ({ ...state, loading: true }));
    this.authService.login(login, password)
      .pipe(
        finalize(() => this.state.update(state => ({ ...state, loading: false }))),
      )
      .subscribe((user) => {
        const { HOME } = RoutesEnum;
        this.state.update(state => ({ ...state, user }));
        this.router.navigate([ HOME ]);
      });
  }

  public logout(): void {
    this.authService.logout().subscribe(() => {
      const { AUTH } = RoutesEnum;

      this.state.update(state => ({ ...state, user: null }));
      this.router.navigate([ AUTH ]);
    });
  }

  private getUserInfo(): Promise<IUser> {
    return lastValueFrom(
      this.authService.getSelf()
        .pipe(
          tap(user => this.state.update(state => ({ ...state, user }))),
          catchError(() => of(null)),
        ),
    );
  }
}