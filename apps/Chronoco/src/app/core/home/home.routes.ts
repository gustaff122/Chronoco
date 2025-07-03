import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco-fe/core/home/home-routing.component').then(c => c.HomeRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco-fe/core/home/views/home-view/home-view.component').then(c => c.HomeViewComponent),
      },
    ],
  },
] satisfies Route[];