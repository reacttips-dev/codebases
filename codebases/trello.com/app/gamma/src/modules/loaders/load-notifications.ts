import api from 'app/gamma/src/api';
import { client } from '@trello/graphql';
import { NotificationsCountDocument } from './NotificationsCountQuery.generated';
import { normalizeNotifications } from 'app/gamma/src/api/normalizers/notification';
import { isFilteringByUnreadNotifications } from 'app/src/components/NotificationsMenu/notificationsMenuState';
import { getLoadingNotificationCounts } from 'app/gamma/src/selectors/ui';
import {
  NotificationGroupResponse,
  NotificationGroupsResponse,
  NotificationResponse,
} from 'app/gamma/src/types/responses';
import {
  NotificationGroupModel,
  NotificationModel,
  NotificationsCountModel,
} from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator } from '@trello/redux';
import { groupNotifications } from 'app/gamma/src/util/model-helpers/notification';
import { State } from 'app/gamma/src/modules/types';
import { refreshIfMissing } from 'app/src/components/ActionEntities/customActions';

// Action types
export const LOAD_NOTIFICATION_GROUPS_REQUEST = Symbol(
  'loaders/LOAD_NOTIFICATION_GROUPS_REQUEST',
);
export const LOAD_NOTIFICATION_GROUPS_SUCCESS = Symbol(
  'loaders/LOAD_NOTIFICATION_GROUPS_SUCCESS',
);
export const LOAD_NOTIFICATION_GROUPS_ERROR = Symbol(
  'loaders/LOAD_NOTIFICATION_GROUPS_ERROR',
);
export const LOAD_NOTIFICATION_GROUPS_CANCELED = Symbol(
  'loaders/LOAD_NOTIFICATION_GROUPS_CANCELED',
);

export const LOAD_UNREAD_NOTIFICATIONS_REQUEST = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_REQUEST',
);
export const LOAD_UNREAD_NOTIFICATIONS_SUCCESS = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_SUCCESS',
);
export const LOAD_UNREAD_NOTIFICATIONS_ERROR = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_ERROR',
);
export const LOAD_UNREAD_NOTIFICATIONS_CANCELED = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_CANCELED',
);

export const LOAD_UNREAD_NOTIFICATIONS_COUNT_REQUEST = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_COUNT_REQUEST',
);

export const LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS',
);

export const LOAD_UNREAD_NOTIFICATIONS_COUNT_ERROR = Symbol(
  'loaders/LOAD_UNREAD_NOTIFICATIONS_COUNT_ERROR',
);

interface LoadNotificationGroupsParams {
  limit?: number;
  skipNotificationGroups?: NotificationGroupModel[];
}

interface LoadNotificationGroupsRequestParams {
  limit?: number;
  skip?: number;
}

export type LoadNotificationGroupsRequestAction = Action<
  typeof LOAD_NOTIFICATION_GROUPS_REQUEST,
  LoadNotificationGroupsRequestParams
>;

export type LoadNotificationGroupsSuccessAction = Action<
  typeof LOAD_NOTIFICATION_GROUPS_SUCCESS,
  {
    notificationGroupsResponse: NotificationGroupResponse[];
    isFilteringByUnread: boolean;
  }
>;

export type LoadNotificationGroupsErrorAction = Action<
  typeof LOAD_NOTIFICATION_GROUPS_ERROR,
  Error
>;

export type LoadNotificationGroupsCanceledAction = Action<
  typeof LOAD_NOTIFICATION_GROUPS_CANCELED,
  void
>;

interface LoadUnreadNotificationsRequestParams {
  limit?: number;
  skip?: number;
}

export type LoadUnreadNotificationsRequestAction = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_REQUEST,
  LoadUnreadNotificationsRequestParams
>;

export type LoadUnreadNotificationsSuccessAction = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_SUCCESS,
  {
    notificationGroupsResponse: NotificationGroupResponse[];
    partialUnreadNotificationGroups: NotificationGroupModel[];
    partialUnreadNotifications: NotificationModel[];
    isFilteringByUnread: boolean;
  }
>;

export type LoadUnreadNotificationsErrorAction = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_ERROR,
  Error
>;

export type LoadUnreadNotificationsCanceledAction = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_CANCELED,
  void
>;

export type LoadUnreadNotificationsCountRequest = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_COUNT_REQUEST,
  void
>;

export type LoadUnreadNotificationsCountSuccess = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS,
  NotificationsCountModel
>;

export type LoadUnreadNotificationsCountError = Action<
  typeof LOAD_UNREAD_NOTIFICATIONS_COUNT_ERROR,
  Error
>;

// Action creators
const loadNotificationGroupsRequest = actionCreator<LoadNotificationGroupsRequestAction>(
  LOAD_NOTIFICATION_GROUPS_REQUEST,
);
const loadNotificationGroupsSuccess = actionCreator<LoadNotificationGroupsSuccessAction>(
  LOAD_NOTIFICATION_GROUPS_SUCCESS,
);
const loadNotificationGroupsError = actionCreator<LoadNotificationGroupsErrorAction>(
  LOAD_NOTIFICATION_GROUPS_ERROR,
);
const loadNotificationGroupsCanceled = actionCreator<LoadNotificationGroupsCanceledAction>(
  LOAD_NOTIFICATION_GROUPS_CANCELED,
);

export const loadUnreadNotificationsRequest = actionCreator<LoadUnreadNotificationsRequestAction>(
  LOAD_UNREAD_NOTIFICATIONS_REQUEST,
);
export const loadUnreadNotificationsSuccess = actionCreator<LoadUnreadNotificationsSuccessAction>(
  LOAD_UNREAD_NOTIFICATIONS_SUCCESS,
);
const loadUnreadNotificationsError = actionCreator<LoadUnreadNotificationsErrorAction>(
  LOAD_UNREAD_NOTIFICATIONS_ERROR,
);
const loadUnreadNotificationsCanceled = actionCreator<LoadUnreadNotificationsCanceledAction>(
  LOAD_UNREAD_NOTIFICATIONS_CANCELED,
);

const loadUnreadNotificationsCountRequest = actionCreator<LoadUnreadNotificationsCountRequest>(
  LOAD_UNREAD_NOTIFICATIONS_COUNT_REQUEST,
);
const loadUnreadNotificationsCountSuccess = actionCreator<LoadUnreadNotificationsCountSuccess>(
  LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS,
);
const loadUnreadNotificationsCountError = actionCreator<LoadUnreadNotificationsCountError>(
  LOAD_UNREAD_NOTIFICATIONS_COUNT_ERROR,
);

export const loadUnreadNotificationsCount = (): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loadUnreadNotificationsCountRequest());

      const { data, error } = await client.query({
        query: NotificationsCountDocument,
      });

      if (error) throw error;

      const count = JSON.parse(data.notificationsCount);

      dispatch(loadUnreadNotificationsCountSuccess(count));
    } catch (err) {
      dispatch(loadUnreadNotificationsCountError(err));
    }
  };
};

const loadSomeNotificationGroups = ({
  limit = 10,
  skipNotificationGroups = [],
}: LoadNotificationGroupsParams = {}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const skip = skipNotificationGroups.length;

      dispatch(loadNotificationGroupsRequest({ limit, skip }));

      const notificationGroupsResponse = await api.client.rest.get<NotificationGroupsResponse>(
        'members/me/notificationGroups',
        {
          query: {
            limit,
            skip,
            card_fields: [
              'due',
              'dueComplete',
              'idBoard',
              'idList',
              'isTemplate',
              'name',
              'start',
              'subscribed',
              'cardRole',
            ],
          },
        },
      );

      // Check if the groups contain any unknown translations, and kick off a
      // load for those if needed
      const translationKeys: Set<string> = notificationGroupsResponse.reduce(
        (keys: Set<string>, group) => {
          group.notifications.forEach((notification) =>
            keys.add(notification.display.translationKey),
          );
          return keys;
        },
        new Set<string>(),
      );
      await refreshIfMissing(...translationKeys);

      const isFilteringByUnread = isFilteringByUnreadNotifications();

      dispatch(
        loadNotificationGroupsSuccess({
          notificationGroupsResponse,
          isFilteringByUnread,
        }),
      );
    } catch (err) {
      dispatch(loadNotificationGroupsError(err));
    }
  };
};

/**
 * This returns the total number of unread notifications in a list
 * of NotificationGroups.
 *
 * This is distinct from the response to `/1/members/me/notificationsCount`,
 * which will include unread notifications that haven't been lazily-loaded
 * yet.
 */
const getLoadedUnreadNotificationCount = (
  notificationGroups: NotificationGroupModel[],
) =>
  notificationGroups.reduce(
    (unreadCount: number, notificationGroup: NotificationGroupModel) =>
      unreadCount +
      notificationGroup.notifications.reduce(
        (unreadCountInner: number, notification: NotificationModel) =>
          unreadCountInner + (notification.unread ? 1 : 0),
        0,
      ),
    0,
  );

export const loadUnreadNotificationGroups = ({
  limit = 10,
  skipNotificationGroups = [],
}: LoadNotificationGroupsParams = {}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      // Since we're using `members/me/notifications` instead of
      // `members/me/notificationGroups`, we need to adjust set the skip
      // parameter to match the number of notifications, rather than the number
      // of notificationGroups.
      const skip = getLoadedUnreadNotificationCount(skipNotificationGroups);

      dispatch(loadUnreadNotificationsRequest({ limit, skip }));

      /*
       Let's load all the unread notifications and group them.

       This api only provides partial groups of notifications
       the groups will only have the unread notifications and none
       of the read ones, this is no good for the ui.

       Therefore the id's for the groups with cards need to be collected
       and then we can request the full groups from the api and merge them
       with the partial groups.
      */

      const page = Math.floor(skip / limit);
      const partialUnreadNotifications = await api.client.rest
        .get<NotificationResponse[]>('members/me/notifications', {
          query: {
            limit,
            page,
            read_filter: 'unread',
            display: 'true',
          },
        })
        .then(normalizeNotifications);

      const partialUnreadNotificationGroups = groupNotifications(
        partialUnreadNotifications,
      );

      const cardIdsToLoad = partialUnreadNotificationGroups.map(
        (group) => group.id,
      );

      const fullUnreadNotificationGroupsResponse = await api.client.rest.get<NotificationGroupsResponse>(
        'notificationGroups',
        {
          query: { idCards: cardIdsToLoad.join(',') },
        },
      );

      const isFilteringByUnread = isFilteringByUnreadNotifications();

      dispatch(
        loadUnreadNotificationsSuccess({
          notificationGroupsResponse: fullUnreadNotificationGroupsResponse,
          partialUnreadNotificationGroups,
          partialUnreadNotifications,
          isFilteringByUnread,
        }),
      );
    } catch (err) {
      dispatch(loadUnreadNotificationsError(err));
    }
  };
};

export const cancelPendingNotificationRequest = (
  cancelUnread: boolean,
): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    // cancel pending request
    if (cancelUnread) {
      dispatch(loadUnreadNotificationsCanceled());
    } else {
      dispatch(loadNotificationGroupsCanceled());
    }
  };
};

export const loadNotificationGroups = ({
  limit = 10,
  skipNotificationGroups = [],
}: LoadNotificationGroupsParams = {}): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const isFilteringByUnread = isFilteringByUnreadNotifications();
    const { loadingUnread, loadingAll } = getLoadingNotificationCounts(state);

    // cancel pending request if we need to
    if (loadingUnread || loadingAll) {
      if (isFilteringByUnread && loadingAll) {
        dispatch(cancelPendingNotificationRequest(false));
      } else if (!isFilteringByUnread && loadingUnread) {
        dispatch(cancelPendingNotificationRequest(true));
      } else {
        // since we're already loading from this group, don't load more
        return;
      }
    }
    if (isFilteringByUnread) {
      dispatch(
        loadUnreadNotificationGroups({
          limit,
          skipNotificationGroups,
        }),
      );
    } else {
      dispatch(
        loadSomeNotificationGroups({
          limit,
          skipNotificationGroups,
        }),
      );
    }
  };
};
