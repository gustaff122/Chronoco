import { RenderMode, ServerRoute } from '@angular/ssr';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export const serverRoutes: ServerRoute[] = [
  {
    path: RoutesEnum.PLANNER,
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
