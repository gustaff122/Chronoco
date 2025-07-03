import { IMenuItem } from '@chronoco-fe/models/i-menu-item';

export const MENU_ITEMS: IMenuItem[] = [
  {
    name: 'Home',
    url: '/',
    icon: 'heroHomeSolid',
  },
  {
    name: 'Wydarzenia',
    url: '/events',
    icon: 'heroFolderOpenSolid',
  },
  {
    name: 'Planer',
    url: '/planner',
    icon: 'heroCalendarSolid',
  },
  {
    name: 'Użytkownicy',
    url: '/users',
    icon: 'heroUserGroupSolid',
  },
];