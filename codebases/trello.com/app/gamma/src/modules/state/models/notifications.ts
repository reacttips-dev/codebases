/* eslint-disable import/no-default-export */
import api from 'app/gamma/src/api';
import {
  normalizeNotification,
  normalizeNotificationGroups,
} from 'app/gamma/src/api/normalizers/notification';
import { TrelloStorage } from '@trello/storage';
import {
  LOAD_NOTIFICATION_GROUPS_CANCELED,
  LOAD_NOTIFICATION_GROUPS_SUCCESS,
  LOAD_UNREAD_NOTIFICATIONS_CANCELED,
  LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS,
  LOAD_UNREAD_NOTIFICATIONS_SUCCESS,
  LoadNotificationGroupsSuccessAction,
  LoadUnreadNotificationsCountSuccess,
  LoadUnreadNotificationsSuccessAction,
} from 'app/gamma/src/modules/loaders/load-notifications';
import {
  DeletedModel,
  isDeletedModel,
  SOCKET_NOTIFICATION,
  SocketNotificationAction,
} from 'app/gamma/src/modules/sockets';
import {
  getNotificationsByGroupId,
  getUnreadNotificationGroups,
  getUnreadNotificationsCountGroup,
} from 'app/gamma/src/selectors/notifications';
import { isFilteringByUnreadNotifications } from 'app/src/components/NotificationsMenu/notificationsMenuState';
import { NotificationResponse } from 'app/gamma/src/types/responses';
import {
  NotificationGroupModel,
  NotificationsCountModel,
} from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { sortBy } from 'underscore';
import { Action, actionCreator, createReducer } from '@trello/redux';
import {
  getNotificationSeenStateGroupCount,
  getNotificationSeenStateKey,
  setNotificationSeenStateGroupCount,
} from 'app/gamma/src/util/application-storage/notification-seen-state';
import {
  groupNotifications,
  setNotificationsInGroupsRead,
} from 'app/gamma/src/util/model-helpers/notification';
import { State } from 'app/gamma/src/modules/types';

const SET_NOTIFICATION_GROUP_READ_REQUEST = Symbol(
  'models/SET_NOTIFICATION_GROUP_READ_REQUEST',
);
const SET_NOTIFICATION_GROUP_READ_SUCCESS = Symbol(
  'models/SET_NOTIFICATION_GROUP_READ_SUCCESS',
);
const SET_NOTIFICATION_GROUP_READ_ERROR = Symbol(
  'models/SET_NOTIFICATION_GROUP_READ_ERROR',
);

const SET_ALL_NOTIFICATIONS_READ_REQUEST = Symbol(
  'models/SET_ALL_NOTIFICATIONS_READ_REQUEST',
);
const SET_ALL_NOTIFICATIONS_READ_SUCCESS = Symbol(
  'models/SET_ALL_NOTIFICATIONS_READ_SUCCESS',
);
const SET_ALL_NOTIFICATIONS_READ_ERROR = Symbol(
  'models/SET_ALL_NOTIFICATIONS_READ_ERROR',
);
const SET_SEEN_UNREAD_NOTIFICATIONS = Symbol(
  'models/SET_SEEN_UNREAD_NOTIFICATIONS',
);

const RESET_NOTIFICATION_GROUPS = Symbol('models/RESET_NOTIFICATION_GROUPS');

interface SetNotificationGroupReadParams {
  idGroup: string;
  read: boolean;
  notificationIds?: string[];
}

export type SetNotificationGroupReadRequestAction = Action<
  typeof SET_NOTIFICATION_GROUP_READ_REQUEST,
  SetNotificationGroupReadParams
>;

interface SetNotificationGroupReadSuccessParams {
  idGroup: string;
  read: boolean;
  isFilteringByUnread: boolean;
}

export type SetNotificationGroupReadSuccessAction = Action<
  typeof SET_NOTIFICATION_GROUP_READ_SUCCESS,
  SetNotificationGroupReadSuccessParams
>;

export type SetNotificationGroupReadErrorAction = Action<
  typeof SET_NOTIFICATION_GROUP_READ_ERROR,
  Error
>;

export type SetAllNotificationsReadRequestAction = Action<
  typeof SET_ALL_NOTIFICATIONS_READ_REQUEST,
  void
>;

export type SetAllNotificationsReadSuccessAction = Action<
  typeof SET_ALL_NOTIFICATIONS_READ_SUCCESS,
  { isFilteringByUnread: boolean }
>;

export type SetAllNotificationsReadErrorAction = Action<
  typeof SET_ALL_NOTIFICATIONS_READ_ERROR,
  { error: Error; unreadCount: NotificationsCountModel; ids: string[] }
>;

export type ResetNotificationGroupsAction = Action<
  typeof RESET_NOTIFICATION_GROUPS,
  void
>;

export type SetSeenUnreadNotificationsAction = Action<
  typeof SET_SEEN_UNREAD_NOTIFICATIONS,
  NotificationsCountModel
>;

export const setNotificationGroupReadRequestAction = actionCreator<SetNotificationGroupReadRequestAction>(
  SET_NOTIFICATION_GROUP_READ_REQUEST,
);

export const setNotificationGroupReadSuccessAction = actionCreator<SetNotificationGroupReadSuccessAction>(
  SET_NOTIFICATION_GROUP_READ_SUCCESS,
);

export const setNotificationGroupReadErrorAction = actionCreator<SetNotificationGroupReadErrorAction>(
  SET_NOTIFICATION_GROUP_READ_ERROR,
);

export const setAllNotificationsReadRequestAction = actionCreator<SetAllNotificationsReadRequestAction>(
  SET_ALL_NOTIFICATIONS_READ_REQUEST,
);

export const setAllNotificationsReadSuccessAction = actionCreator<SetAllNotificationsReadSuccessAction>(
  SET_ALL_NOTIFICATIONS_READ_SUCCESS,
);

export const setAllNotificationsReadErrorAction = actionCreator<SetAllNotificationsReadErrorAction>(
  SET_ALL_NOTIFICATIONS_READ_ERROR,
);

export const resetNotificationGroupsAction = actionCreator<ResetNotificationGroupsAction>(
  RESET_NOTIFICATION_GROUPS,
);

export const setSeenUnreadNotificationsAction = actionCreator<SetSeenUnreadNotificationsAction>(
  SET_SEEN_UNREAD_NOTIFICATIONS,
);

export interface NotificationsState {
  cancelLoading: boolean;
  cancelLoadingUnread: boolean;
  notificationGroups: NotificationGroupModel[];
  notificationGroupsStale: boolean;
  unreadCount: NotificationsCountModel;
  seenUnreadCount: NotificationsCountModel;
}

export const initialNotificationsState: NotificationsState = {
  cancelLoading: false,
  cancelLoadingUnread: false,
  notificationGroups: [],
  notificationGroupsStale: false,
  unreadCount: {},
  // eslint-disable-next-line @trello/no-module-logic
  seenUnreadCount: getNotificationSeenStateGroupCount(),
};

// Takes an id like Card:5c2d1616e23b680add1cf24d and converts it
// to the id form which would be 5c2d1616e23b680add1cf24d removing
// the type prefix of Card
const convertIdGroupToId = (idGroup: string) => idGroup.split(':')[1];

// We take the input from the responses that might have be received from
// server and compare that with what we already have, if the notification
// group already exists we replace it, then finally if we are filtering
// by unread make sure to remove any read only groups from the source.
// Finally we sort these to make sure they are always returned in the
// correct order
export const sanitizeNotificationGroups = (
  existing: NotificationGroupModel[],
  incoming: NotificationGroupModel[],
  isFilteringByUnread: boolean,
): NotificationGroupModel[] => {
  const mergedGroups = existing.map((existingGroup) => {
    const duplicate = incoming.find(
      (incomingGroup) => incomingGroup.id === existingGroup.id,
    );

    return duplicate ? duplicate : existingGroup;
  });

  const newGroups = incoming.filter((potentialNewGroup) => {
    const duplicate = existing.find(
      (existingGroup) => existingGroup.id === potentialNewGroup.id,
    );

    return !duplicate;
  });

  // append remaining incoming groups
  const joinedGroups =
    newGroups.length > 0 ? [...mergedGroups, ...newGroups] : mergedGroups;

  const filteredGroups = joinedGroups.filter((notificationGroup) =>
    isFilteringByUnread
      ? notificationGroup.notifications.some(
          (notification) => !!notification.unread,
        )
      : true,
  );

  // Sort the notifications to confirm the order is correct
  const sortedNotifications = filteredGroups.map((notificationGroup) => ({
    ...notificationGroup,
    notifications: sortBy(notificationGroup.notifications, (notification) =>
      notification.date ? new Date(notification.date).getTime() : 0,
    ),
  }));

  // We sort the group by the date of the last notification in the
  // group, which will be the newest.
  return sortBy(sortedNotifications, (notificationGroup) => {
    const lastNotification = notificationGroup.notifications.slice(-1)[0];

    return (
      lastNotification &&
      lastNotification.date &&
      -new Date(lastNotification.date).getTime()
    );
  });
};

export const updateUnreadCount = (
  state: NotificationsCountModel,
  idGroup: string,
  direction: number,
) => {
  const { [idGroup]: count, ...rest } = state;
  const newCount = (count || 0) + direction;
  const newCountGroup =
    newCount > 0
      ? {
          ...rest,
          [idGroup]: newCount,
        }
      : rest;

  return newCountGroup;
};

const getNotificationById = (
  state: NotificationsState,
  idNotification: string,
) => {
  for (const notificationGroup of state.notificationGroups) {
    for (const notification of notificationGroup.notifications) {
      if (notification.id === idNotification) {
        return notification;
      }
    }
  }
};

export const addOrUpdateNotification = (
  notificationGroups: NotificationGroupModel[],
  idGroup: string,
  delta: NotificationResponse,
) => {
  // Find existing group and notification if they exist.
  const existingGroup = notificationGroups.find(
    (notificationGroup) => notificationGroup.idGroup === idGroup,
  );

  const existingNotification =
    existingGroup &&
    existingGroup.notifications.find(
      (notification) => notification.id === delta.id,
    );

  // If we have an existing group and an existing notifications lets find
  // that notification and update it, if we don't have an existing
  // notification then add the notification to the the existing group and
  // if we don't have an existing group create a new one with the new
  // notification.
  const newNotifications = existingGroup
    ? existingNotification
      ? existingGroup.notifications.map((notification) =>
          notification.id === delta.id
            ? normalizeNotification(delta, notification)
            : notification,
        )
      : [...existingGroup.notifications, normalizeNotification(delta)]
    : [normalizeNotification(delta)];

  // Take new notifications and create a group from them.
  const newGroup = groupNotifications(newNotifications)[0];

  if (newGroup === undefined) {
    // When does this happen?
    // https://trello.atlassian.net/projects/TRELP/queues/issue/TRELP-1852
    return notificationGroups;
  }

  // Either put the notification into an existing group, or create a new group
  return existingGroup !== undefined
    ? notificationGroups.map(
        (notificationGroup): NotificationGroupModel =>
          notificationGroup.idGroup === idGroup ? newGroup : notificationGroup,
      )
    : [newGroup, ...notificationGroups];
};

// Look through the notification groups and their notifications
// and remove the given notification from the data.
export const removeNotification = (
  notificationGroups: NotificationGroupModel[],
  id: string,
  delta: DeletedModel,
) =>
  notificationGroups.map((notificationGroup) => ({
    ...notificationGroup,
    notifications: notificationGroup.notifications.filter(
      (notification) => notification.id !== delta.id,
    ),
  }));

export default createReducer(initialNotificationsState, {
  [LOAD_NOTIFICATION_GROUPS_SUCCESS](
    state,
    { payload }: LoadNotificationGroupsSuccessAction,
  ) {
    const { notificationGroupsResponse, isFilteringByUnread } = payload;

    const notificationGroups = normalizeNotificationGroups(
      notificationGroupsResponse,
    );

    if (state.cancelLoading) {
      // this request has been replaced by another one, and is irrelevant
      return {
        ...state,
        cancelLoading: false,
      };
    } else {
      const existingGroups = state.notificationGroupsStale
        ? []
        : state.notificationGroups;

      return {
        ...state,
        notificationGroups: sanitizeNotificationGroups(
          existingGroups,
          notificationGroups,
          isFilteringByUnread,
        ),
        notificationGroupsStale: false,
      };
    }
  },

  [LOAD_UNREAD_NOTIFICATIONS_COUNT_SUCCESS](
    state,
    { payload }: LoadUnreadNotificationsCountSuccess,
  ) {
    return {
      ...state,
      unreadCount: payload,
    };
  },

  [SET_SEEN_UNREAD_NOTIFICATIONS](
    state,
    { payload }: LoadUnreadNotificationsCountSuccess,
  ) {
    return {
      ...state,
      seenUnreadCount: payload,
    };
  },

  [LOAD_UNREAD_NOTIFICATIONS_SUCCESS](
    state,
    { payload }: LoadUnreadNotificationsSuccessAction,
  ) {
    const {
      notificationGroupsResponse,
      partialUnreadNotificationGroups,
      isFilteringByUnread,
    } = payload;

    const fullUnreadNotificationGroups = normalizeNotificationGroups(
      notificationGroupsResponse,
    );

    const notificationGroups = partialUnreadNotificationGroups.map((group) => {
      const fullGroup = fullUnreadNotificationGroups.find(
        (g) => g.idGroup === group.idGroup,
      );

      return {
        ...group,
        ...fullGroup,
      };
    });

    if (state.cancelLoadingUnread) {
      // this request has been replaced by another one, and is irrelevant
      return {
        ...state,
        cancelLoadingUnread: false,
      };
    } else {
      const existingGroups = state.notificationGroupsStale
        ? []
        : state.notificationGroups;

      return {
        ...state,
        notificationGroups: sanitizeNotificationGroups(
          existingGroups,
          notificationGroups,
          isFilteringByUnread,
        ),
        notificationGroupsStale: false,
      };
    }
  },

  [SET_ALL_NOTIFICATIONS_READ_REQUEST](state) {
    return {
      ...state,
      unreadCount: {},
      notificationGroups: setNotificationsInGroupsRead(
        state.notificationGroups,
        true,
      ),
    };
  },

  [SET_ALL_NOTIFICATIONS_READ_SUCCESS](
    state,
    { payload }: SetAllNotificationsReadSuccessAction,
  ) {
    const { isFilteringByUnread } = payload;

    // If we mark all notifications as read and we are
    // filtering, clear them to update the ui to show sleepy taco.
    // We blank the array to match what the server would return.
    if (isFilteringByUnread) {
      return {
        ...state,
        notificationGroups: [],
      };
    } else {
      return state;
    }
  },

  [SET_ALL_NOTIFICATIONS_READ_ERROR](
    state,
    { payload }: SetAllNotificationsReadErrorAction,
  ) {
    const { unreadCount, ids } = payload;

    return {
      ...state,
      unreadCount,
      notificationGroups: setNotificationsInGroupsRead(
        state.notificationGroups,
        false,
        ids,
      ),
    };
  },

  [SET_NOTIFICATION_GROUP_READ_SUCCESS](
    state,
    { payload }: SetNotificationGroupReadSuccessAction,
  ) {
    const { isFilteringByUnread, idGroup, read } = payload;
    const id = convertIdGroupToId(idGroup);

    if (isFilteringByUnread && read) {
      // If we mark a notification group as read and we
      // are filtering, remove the notification group
      return {
        ...state,
        notificationGroups: state.notificationGroups.filter(
          (notificationGroup) => notificationGroup.id !== id,
        ),
      };
    } else {
      return state;
    }
  },

  [SET_NOTIFICATION_GROUP_READ_REQUEST](
    state,
    { payload }: SetNotificationGroupReadRequestAction,
  ) {
    const { idGroup, read, notificationIds } = payload;
    const id = convertIdGroupToId(idGroup);

    let numNotifications = 0;
    const existingGroup = state.notificationGroups.find(
      (notificationGroup) => notificationGroup.idGroup === idGroup,
    );
    if (existingGroup) {
      for (const notification of existingGroup.notifications) {
        if (
          (!notificationIds || notificationIds.includes(notification.id)) &&
          notification.unread === read
        ) {
          numNotifications++;
        }
      }
    }
    const unreadDelta = read ? -numNotifications : numNotifications;
    const newUnreadCount = updateUnreadCount(
      state.unreadCount,
      idGroup,
      unreadDelta,
    );

    return {
      ...state,
      unreadCount: newUnreadCount,
      seenUnreadCount: newUnreadCount,
      notificationGroups: setNotificationsInGroupsRead(
        state.notificationGroups,
        read,
        id,
        notificationIds,
      ),
    };
  },

  [RESET_NOTIFICATION_GROUPS](
    state,
    { payload }: ResetNotificationGroupsAction,
  ) {
    return {
      ...state,
      notificationGroupsStale: true,
    };
  },

  [LOAD_NOTIFICATION_GROUPS_CANCELED](state) {
    return {
      ...state,
      cancelLoading: true,
    };
  },

  [LOAD_UNREAD_NOTIFICATIONS_CANCELED](state) {
    return {
      ...state,
      cancelLoadingUnread: true,
    };
  },

  [SOCKET_NOTIFICATION](state, { payload }: SocketNotificationAction) {
    const {
      delta,
      isFilteringByUnreadNotifications: isFilteringByUnread,
    } = payload;

    let notificationGroups = state.notificationGroups;
    let unreadCount = state.unreadCount;

    if (isDeletedModel(delta)) {
      const existingNotification = getNotificationById(state, delta.id);

      if (existingNotification) {
        notificationGroups = removeNotification(
          state.notificationGroups,
          delta.id,
          delta,
        );

        if (existingNotification.unread) {
          const idGroup =
            existingNotification.data && existingNotification.data.card
              ? `Card:${existingNotification.data.card.id}`
              : `Notification:${delta.id}`;

          unreadCount = updateUnreadCount(unreadCount, idGroup, -1);
        }
      }
    } else {
      // Create idGroup for notification
      const idGroup =
        delta.data && delta.data.card
          ? `Card:${delta.data.card.id}`
          : `Notification:${delta.id}`;

      const existingNotification = getNotificationById(state, delta.id);

      if (
        existingNotification &&
        existingNotification.unread !== delta.unread
      ) {
        unreadCount = updateUnreadCount(
          unreadCount,
          idGroup,
          existingNotification.unread ? -1 : 1,
        );
      } else if (!existingNotification && delta.unread) {
        unreadCount = updateUnreadCount(unreadCount, idGroup, 1);
      }

      notificationGroups = addOrUpdateNotification(
        state.notificationGroups,
        idGroup,
        delta,
      );
    }

    return {
      ...state,
      notificationGroups: sanitizeNotificationGroups(
        state.notificationGroups,
        notificationGroups,
        isFilteringByUnread,
      ),
      unreadCount,
    };
  },
});

const readAllNotifications = (
  body: { ids: string; read: boolean } | object = {},
) => api.client.rest.post<void>('notifications/all/read', { body });

export const setAllNotificationsRead = (): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    // in case we need to revert
    const idUnreadNotificationGroups = getUnreadNotificationGroups(state).map(
      (ng) => ng.id,
    );

    const unreadCountGroup = getUnreadNotificationsCountGroup(state);

    try {
      dispatch(setAllNotificationsReadRequestAction());

      await readAllNotifications();

      const isFilteringByUnread = isFilteringByUnreadNotifications();

      dispatch(setAllNotificationsReadSuccessAction({ isFilteringByUnread }));

      setNotificationSeenStateGroupCount(
        getUnreadNotificationsCountGroup(getState()),
      );
    } catch (err) {
      dispatch(
        setAllNotificationsReadErrorAction({
          error: err,
          unreadCount: unreadCountGroup,
          ids: idUnreadNotificationGroups,
        }),
      );
    }
  };
};

export const setNotificationGroupRead = ({
  idGroup,
  read,
  notificationIds,
}: SetNotificationGroupReadParams): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const id = convertIdGroupToId(idGroup);

    dispatch(
      setNotificationGroupReadRequestAction({
        idGroup,
        read,
        notificationIds,
      }),
    );

    const ids =
      notificationIds ||
      getNotificationsByGroupId(getState(), id).map((n) => n.id);

    try {
      await readAllNotifications({ ids: ids.join(','), read });
    } catch (err) {
      dispatch(
        setNotificationGroupReadRequestAction({
          idGroup,
          read: !read,
          notificationIds,
        }),
      ); // undo the change
      dispatch(setNotificationGroupReadErrorAction(err));
      return;
    }
    const isFilteringByUnread = isFilteringByUnreadNotifications();

    dispatch(
      setNotificationGroupReadSuccessAction({
        idGroup,
        read,
        isFilteringByUnread,
      }),
    );

    setNotificationSeenStateGroupCount(
      getUnreadNotificationsCountGroup(getState()),
    );
  };
};

export const resetNotificationGroups = (): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(resetNotificationGroupsAction());
  };
};

// eslint-disable-next-line @trello/no-module-logic
TrelloStorage.listenSyncedAcrossBrowser(({ key, newValue }, dispatch) => {
  if (dispatch && key === getNotificationSeenStateKey()) {
    dispatch(
      setSeenUnreadNotificationsAction(getNotificationSeenStateGroupCount()),
    );
  }
});
