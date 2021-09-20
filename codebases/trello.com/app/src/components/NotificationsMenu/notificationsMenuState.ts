import { PersistentSharedState } from '@trello/shared-state';
import { memberId } from '@trello/session-cookie';

interface NotificationsMenuState {
  visibilityFilter: 'VISIBILITY_ALL' | 'VISIBILITY_UNREAD';
}

export const getNotificationFilterStateKey = () => {
  return `notificationFilterState-${memberId}`;
};

const initialState: NotificationsMenuState = {
  visibilityFilter: 'VISIBILITY_UNREAD',
};

// eslint-disable-next-line @trello/no-module-logic
export const notificationsMenuState = new PersistentSharedState<NotificationsMenuState>(
  initialState,
  // eslint-disable-next-line @trello/no-module-logic
  { storageKey: getNotificationFilterStateKey() },
);

export const isNotificationFilterVisibilityAll = () =>
  notificationsMenuState.value.visibilityFilter === 'VISIBILITY_ALL';

export const isFilteringByUnreadNotifications = () =>
  !notificationsMenuState.value ||
  notificationsMenuState.value.visibilityFilter === 'VISIBILITY_UNREAD';
