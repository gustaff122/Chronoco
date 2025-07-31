import { computed, inject, Injectable, ResourceRef, Signal, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { IUser } from '../../services/auth-service/models/i-user';
import { rxResource } from '@angular/core/rxjs-interop';

interface IAuthState {
  user: IUser;
  isLoggedIn: boolean;
  loading: boolean;
}

const DEFAULT_STATE: IAuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authService: AuthService = inject(AuthService);

  private readonly state: WritableSignal<IAuthState> = signal(DEFAULT_STATE);
  private readonly userResource: ResourceRef<IUser> = rxResource({
    stream: () => this.authService.getSelf(),
    defaultValue: null,
  });

  public readonly user: Signal<IUser> = computed(() => this.state()?.user ? this.state().user : this.userResource.value());

}