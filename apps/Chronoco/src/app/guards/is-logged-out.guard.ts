import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@chronoco-fe/stores/auth-store/auth.store';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export const isLoggedOut: CanActivateFn = () => {
  const authStore: AuthStore = inject(AuthStore);
  const router: Router = inject(Router);

  const isLoggedOut = !authStore.isLoggedIn();

  console.log('isLoggedOut', isLoggedOut);

  return isLoggedOut || router.parseUrl(RoutesEnum.HOME);
};