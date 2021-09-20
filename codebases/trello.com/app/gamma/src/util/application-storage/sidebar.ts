/* eslint-disable @trello/disallow-filenames */
import { SavedSearchModel } from 'app/gamma/src/types/models';

import { PersistentSharedState } from '@trello/shared-state';
import { memberId } from '@trello/session-cookie';

const initialState: SidebarValues = {};

export interface SidebarValues {
  readonly collapsedDrawerSections?: string[];
  readonly idRecentBoards?: string[];
  readonly pinBoardsListSidebar?: boolean;
  readonly showBoardsListSidebar?: boolean;
  readonly savedSearches?: SavedSearchModel[];
}

// eslint-disable-next-line @trello/no-module-logic
export const sidebarState = new PersistentSharedState<SidebarValues>(
  initialState,
  {
    storageKey: `sidebarState-${memberId ?? 'anonymous'}`,
  },
);

export const getSidebarValues = (): SidebarValues | null => sidebarState.value;

export const setSidebarValues = (state: SidebarValues) => {
  sidebarState.setValue(state);
};
