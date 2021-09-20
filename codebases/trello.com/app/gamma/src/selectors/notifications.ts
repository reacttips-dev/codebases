import { State } from 'app/gamma/src/modules/types';
import {
  NotificationGroupModel,
  NotificationModel,
  NotificationsCountModel,
} from 'app/gamma/src/types/models';

function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[],
): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

const isUnreadNotificationGroup = (notificationGroup: NotificationGroupModel) =>
  notificationGroup.notifications.some((n) => !!n.unread);

export const isNotificationGroupsStale = (state: State) => {
  return state.models.notifications.notificationGroupsStale;
};

export const getNotificationGroups = (state: State) => {
  return state.models.notifications.notificationGroups;
};

export const getUnreadNotificationGroups = (state: State) => {
  return getNotificationGroups(state).filter(isUnreadNotificationGroup);
};

export const getNotificationGroup = (
  state: State,
  idNotificationGroup: string,
) => {
  return state.models.notifications.notificationGroups.filter(
    (ng) => ng.id === idNotificationGroup,
  )[0];
};

export const getNotificationsByGroupId = (
  state: State,
  idNotificationGroup: string,
) => {
  const notificationGroup = getNotificationGroup(state, idNotificationGroup);

  return notificationGroup ? notificationGroup.notifications : [];
};

export const getNotificationGroupByNotificationId = (
  state: State,
  idNotification: string,
) => {
  const notificationGroups = getNotificationGroups(state).filter(
    ({ notifications }) => {
      return notifications.filter(({ id }) => id === idNotification).length > 0;
    },
  );

  return notificationGroups.length ? notificationGroups[0] : null;
};

export const hasUnreadNotifications = (
  state: State,
  idNotificationGroup: string,
) => {
  const notificationGroup = getNotificationGroup(state, idNotificationGroup);

  return notificationGroup
    ? isUnreadNotificationGroup(notificationGroup)
    : false;
};

export const getUnseenNotificationsCount = (state: State) => {
  const currentUnreadCount = state.models.notifications.unreadCount;
  const seenUnreadCount = state.models.notifications.seenUnreadCount;

  // Calculates the difference between two NotificationsCountModels
  const combinedCounts = Object.entries(currentUnreadCount).reduce(
    (acc: NotificationsCountModel, [key, count]) => {
      if (count > (seenUnreadCount[key] || 0)) {
        acc[key] = currentUnreadCount[key];
      }

      return acc;
    },
    {},
  );

  return Object.values(combinedCounts).length;
};

export const getUnreadNotificationsCountGroup = (state: State) => {
  return state.models.notifications.unreadCount;
};

export const getUnreadNotificationsCountForCard = (
  state: State,
  idCard: string,
) => {
  return state.models.notifications.notificationGroups.reduce(
    (totalCount: number, group: NotificationGroupModel) => {
      return group.notifications.reduce(
        (count: number, notification: NotificationModel) => {
          const card = notification.data && notification.data.card;

          return notification.unread && card && card.id === idCard
            ? count + 1
            : count;
        },
        totalCount,
      );
    },
    0,
  );
};

export const getNotificationByActionId = (state: State, idAction: string) => {
  const notifications = flatMap<NotificationGroupModel, NotificationModel>(
    state.models.notifications.notificationGroups,
    (notificationGroup: NotificationGroupModel) => {
      return notificationGroup.notifications.filter(
        (notification) => notification.idAction === idAction,
      );
    },
  );

  return notifications.length ? notifications[0] : null;
};
