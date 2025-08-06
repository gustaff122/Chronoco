import { Route } from '@angular/router';
import { isLoggedOut } from './guards/is-logged-out.guard';
import { isLoggedIn } from './guards/is-logged-in.guard';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco-fe/shell/shell-logged-in/shell-logged-in.component').then(c => c.ShellLoggedInComponent),
        canActivate: [ isLoggedIn ],
        children: [
          {
            path: '',
            loadChildren: () => import('@chronoco-fe/core/home/home.routes'),
          },
          {
            path: RoutesEnum.PLANNER,
            loadChildren: () => import('@chronoco-fe/core/planner/planner.routes'),
          },
        ],
      },
      {
        path: RoutesEnum.AUTH,
        loadChildren: () => import('@chronoco-fe/core/auth/auth.routes'),
        canActivate: [ isLoggedOut ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
