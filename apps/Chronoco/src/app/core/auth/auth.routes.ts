import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco-fe/core/auth/auth-routing.component').then(c => c.AuthRoutingComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('@chronoco-fe/core/auth/views/login-view/login-view.component').then(c => c.LoginViewComponent),
      },
    ],
  },
] satisfies Route[];