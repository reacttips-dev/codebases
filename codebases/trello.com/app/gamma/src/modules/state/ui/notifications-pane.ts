/* eslint-disable import/no-default-export */
import { TrelloStorage } from '@trello/storage';
import {
  LOAD_NOTIFICATION_GROUPS_ERROR,
  LOAD_NOTIFICATION_GROUPS_REQUEST,
  LOAD_NOTIFICATION_GROUPS_SUCCESS,
  LOAD_UNREAD_NOTIFICATIONS_ERROR,
  LOAD_UNREAD_NOTIFICATIONS_REQUEST,
  LOAD_UNREAD_NOTIFICATIONS_SUCCESS,
  loadNotificationGroups,
  LoadNotificationGroupsRequestAction,
  LoadNotificationGroupsSuccessAction,
  LoadUnreadNotificationsRequestAction,
  LoadUnreadNotificationsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-notifications';
import { resetNotificationGroups } from 'app/gamma/src/modules/state/models/notifications';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { createReducer } from '@trello/redux';
import { getNotificationFilterStateKey } from 'app/src/components/NotificationsMenu/notificationsMenuState';

// Reducer
export interface NotificationsPaneState {
  loading: number;
  loadingUnread: number;
  moreToLoad: boolean;
  moreUnreadToLoad: boolean;
}

const initialState: NotificationsPaneState = {
  loading: 0,
  loadingUnread: 0,
  moreToLoad: true,
  moreUnreadToLoad: true,
};

export default createReducer(initialState, {
  [LOAD_NOTIFICATION_GROUPS_REQUEST](
    state,
    { payload }: LoadNotificationGroupsRequestAction,
  ) {
    return {
      ...state,
      loading: payload.limit,
    };
  },

  [LOAD_NOTIFICATION_GROUPS_SUCCESS](
    state,
    { payload }: LoadNotificationGroupsSuccessAction,
  ) {
    return {
      ...state,
      loading: 0,
      moreToLoad:
        state.loading - payload.notificationGroupsResponse.length === 0,
    };
  },

  [LOAD_NOTIFICATION_GROUPS_ERROR](state) {
    return {
      ...state,
      loading: 0,
    };
  },

  [LOAD_UNREAD_NOTIFICATIONS_REQUEST](
    state,
    { payload }: LoadUnreadNotificationsRequestAction,
  ) {
    return {
      ...state,
      loadingUnread: payload.limit,
    };
  },

  [LOAD_UNREAD_NOTIFICATIONS_SUCCESS](
    state,
    { payload }: LoadUnreadNotificationsSuccessAction,
  ) {
    return {
      ...state,
      loadingUnread: 0,
      moreUnreadToLoad:
        state.loadingUnread - payload.partialUnreadNotifications.length === 0,
    };
  },

  [LOAD_UNREAD_NOTIFICATIONS_ERROR](state) {
    return {
      ...state,
      loadingUnread: 0,
    };
  },
});

export const loadNotifications = (): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(resetNotificationGroups());
    dispatch(loadNotificationGroups());
  };
};

// eslint-disable-next-line @trello/no-module-logic
TrelloStorage.listenSyncedAcrossBrowser(({ key }, dispatch: Dispatch) => {
  if (dispatch && key === getNotificationFilterStateKey()) {
    dispatch(loadNotifications());
  }
});
