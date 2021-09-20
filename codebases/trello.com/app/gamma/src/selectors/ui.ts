import { State } from 'app/gamma/src/modules/types';
import { isFilteringByUnreadNotifications } from 'app/src/components/NotificationsMenu/notificationsMenuState';

export const shouldShowLessActiveBoards = (
  state: State,
  idTeam: string | null = null,
): boolean => state.ui.boardsMenu.teamsShowingLessActiveBoards.includes(idTeam);

export const getReopenBoardAdminNames = (state: State) => {
  const popover = state.ui.boardsMenu.reopenBoardPopover;

  return popover ? popover.adminNames : [];
};

export const getReopenBoardNewBillableGuests = (state: State) => {
  const popover = state.ui.boardsMenu.reopenBoardPopover;

  return popover ? popover.newBillableGuests : [];
};

export const getReopenBoardAvailableLicenseCount = (state: State) => {
  const popover = state.ui.boardsMenu.reopenBoardPopover;

  return popover ? popover.availableLicenseCount : Infinity;
};

export const getLoadingNotificationCounts = (
  state: State,
): {
  loadingUnread: number;
  loadingAll: number;
} => {
  return {
    loadingUnread: state.ui.notificationsPane.loadingUnread,
    loadingAll: state.ui.notificationsPane.loading,
  };
};

export const isLoadingNotifications = (state: State) => {
  const counts = getLoadingNotificationCounts(state);

  return counts.loadingUnread > 0 || counts.loadingAll > 0;
};

export const shouldLoadMoreNotifications = (state: State) => {
  return isFilteringByUnreadNotifications()
    ? state.ui.notificationsPane.moreUnreadToLoad
    : state.ui.notificationsPane.moreToLoad;
};

export const isLoadingClosedBoards = (state: State) => {
  return state.ui.closedBoards.isLoading;
};

export const hasErrorLoadingClosedBoards = (state: State) => {
  return state.ui.closedBoards.hasError;
};
