import { IMenuItem } from '@chronoco-fe/models/i-menu-item';
import { RoutesEnum } from '@chronoco-fe/models/routes.enum';

export const MENU_ITEMS: IMenuItem[] = [
  {
    name: 'Home',
    url: `/${RoutesEnum.HOME}`,
    icon: 'heroHomeSolid',
  },
  {
    name: 'Wydarzenia',
    url: `/${RoutesEnum.EVENTS}`,
    icon: 'heroFolderOpenSolid',
  },
  {
    name: 'Planer',
    url: `/${RoutesEnum.PLANNER}`,
    icon: 'heroCalendarSolid',
  },
  {
    name: 'Użytkownicy',
    url: `/${RoutesEnum.USERS}`,
    icon: 'heroUserGroupSolid',
  },
];