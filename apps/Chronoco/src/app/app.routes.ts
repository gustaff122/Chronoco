import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco-fe/shell/shell-logged-in/shell-logged-in.component').then(c => c.ShellLoggedInComponent),
        children: [
          {
            path: '',
            loadChildren: () => import('@chronoco-fe/core/home/home.routes'),
          },
          {
            path: 'planner',
            loadChildren: () => import('@chronoco-fe/core/planner/planner.routes'),
          },
        ],
      },
      {
        path: 'auth',
        loadChildren: () => import('@chronoco-fe/core/auth/auth.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
