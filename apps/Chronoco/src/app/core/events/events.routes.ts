import { Route } from '@angular/router';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco-fe/core/events/events-routing.component').then(c => c.EventsRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco-fe/core/events/views/events-list-view/events-list-view.component').then(c => c.EventsListViewComponent),
      },
      {
        path: RoutesEnum.EVENTS_ADD,
        loadComponent: () => import('@chronoco-fe/core/events/views/event-add-edit-view/event-add-edit-view.component').then(c => c.EventAddEditViewComponent),
      },
      {
        path: `${RoutesEnum.EVENTS_EDIT}/${RoutesEnum.EVENTS_EDIT_ID}`,
        loadComponent: () => import('@chronoco-fe/core/events/views/event-add-edit-view/event-add-edit-view.component').then(c => c.EventAddEditViewComponent),
      },
    ],
  },
] satisfies Route[];