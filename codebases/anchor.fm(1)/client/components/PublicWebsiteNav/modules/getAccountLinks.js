import { ACCOUNT_MENU_ITEMS } from '../constants';

export const getAccountLinks = (additionalLinks = []) => [
  ...ACCOUNT_MENU_ITEMS,
  ...additionalLinks,
];
