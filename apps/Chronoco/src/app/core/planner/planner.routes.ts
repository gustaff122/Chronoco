import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco-fe/core/planner/planner-routing.component').then(c => c.PlannerRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco-fe/core/planner/views/planner-view/planner-view.component').then(c => c.PlannerViewComponent),
      },
    ],
  },
] satisfies Route[];