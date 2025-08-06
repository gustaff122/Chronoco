import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@chronoco-fe/stores/auth-store/auth.store';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export const isLoggedIn: CanActivateFn = () => {
  const authStore: AuthStore = inject(AuthStore);
  const router: Router = inject(Router);

  const isLoggedIn = authStore.isLoggedIn();

  return isLoggedIn || router.parseUrl(RoutesEnum.AUTH);
};