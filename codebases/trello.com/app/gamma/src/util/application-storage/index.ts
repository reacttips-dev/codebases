/* eslint-disable @trello/disallow-filenames */
import { getSidebarValues, setSidebarValues, SidebarValues } from './sidebar';
import { TrelloStorage } from '@trello/storage';
import { memberId } from '@trello/session-cookie';

export const setLocalStorageUser = (idMe = memberId) => {
  if (idMe) {
    TrelloStorage.set('idMe', idMe);
  }
};

// eslint-disable-next-line @trello/no-module-logic
setLocalStorageUser();

export interface LocalStorageValues {
  readonly sidebar: SidebarValues;
}

export const getState = (): LocalStorageValues => {
  return {
    sidebar: getSidebarValues() || ({} as SidebarValues),
  };
};

export const setState = (state: LocalStorageValues) => {
  setSidebarValues(state.sidebar);
};
