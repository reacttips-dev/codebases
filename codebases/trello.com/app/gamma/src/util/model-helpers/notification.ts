/* eslint-disable @trello/disallow-filenames */
import {
  ActionDataModel,
  CardModel,
  NotificationGroupModel,
  NotificationModel,
} from 'app/gamma/src/types/models';
import { difference, filter, last } from 'underscore';
import { getCardUrl, makeSlug } from 'app/gamma/src/util/url';

export const isCommentLike = ({
  type,
  data,
}: Pick<NotificationModel, 'type' | 'data'>): boolean => {
  if (!type) {
    return false;
  }

  return (
    ['commentCard', 'copyCommentCard', 'mentionedOnCard'].includes(type) ||
    (type === 'reactionAdded' && !!data && data.actionType === 'commentCard')
  );
};

export const shouldGenerateActionLink = ({
  type,
  data,
}: Pick<NotificationModel, 'type' | 'data'>) =>
  isCommentLike({ type, data }) ||
  (type &&
    [
      'changeCard',
      'createdCard',
      'addAttachmentToCard',
      'addedToCard',
      'removedFromCard',
      'cardDueSoon',
    ].includes(type));

export const getActionHash = ({
  type,
  data,
  idAction,
}: Pick<NotificationModel, 'type' | 'data' | 'idAction'>) => {
  if (idAction) {
    if (isCommentLike({ type, data })) {
      return `comment-${idAction}`;
    }
    return `action-${idAction}`;
  }

  return '';
};

export const getNotificationCardShortUrl = (data: ActionDataModel) => {
  const card = data.card;
  if (card) {
    return `/c/${card.shortLink}/${card.idShort}-${makeSlug(card.name || '')}`;
  } else {
    return '#';
  }
};

export const getActionLink = function (
  notification: Pick<NotificationModel, 'type' | 'data' | 'idAction'>,
  card?: CardModel,
) {
  if (shouldGenerateActionLink(notification)) {
    const actionHash = getActionHash(notification);

    if (card && card.url) {
      return getCardUrl(card, actionHash);
    } else if (notification.data && notification.data.card) {
      return `${getNotificationCardShortUrl(notification.data)}#${actionHash}`;
    }
  }
};

export interface ArchiveObject {
  active: NotificationModel[];
  archive: NotificationModel[];
}

export const mapNotificationsToArchive = (
  notifications: NotificationModel[],
): ArchiveObject => {
  let { active, archive } = notifications.reduce<ArchiveObject>(
    (acc, notification) => {
      if (notification.unread) {
        acc.active.push(notification);
      } else {
        acc.archive.push(notification);
      }

      return acc;
    },
    { active: [], archive: [] },
  );

  if (!active.length && archive.length) {
    const lastDateRead = last(archive)!.dateRead;
    if (lastDateRead) {
      active = filter(
        archive,
        (notification) =>
          (notification.dateRead || '').toString() === lastDateRead.toString(),
      );
    } else {
      active = last(archive, 1);
    }
    archive = difference(archive, active);
  }

  return { active, archive };
};

export const setNotificationsInGroupRead = (
  notificationGroup: NotificationGroupModel,
  read: boolean,
  notificationsIds?: string[],
) => ({
  ...notificationGroup,

  notifications: notificationGroup.notifications.map((notification) =>
    notificationsIds && !notificationsIds.includes(notification.id)
      ? notification
      : {
          ...notification,
          dateRead: read ? notification.dateRead || new Date() : null,
          unread: !read,
        },
  ),
});

export const setNotificationsInGroupsRead = (
  notificationGroups: NotificationGroupModel[],
  read: boolean,
  id?: string | string[],
  notificationsIds?: string[],
) =>
  notificationGroups.map((notificationGroup) =>
    id === undefined ||
    (typeof id === 'string' && notificationGroup.id === id) ||
    (Array.isArray(id) && id.includes(notificationGroup.id))
      ? setNotificationsInGroupRead(notificationGroup, read, notificationsIds)
      : notificationGroup,
  );

export const groupNotifications = (
  notifications: NotificationModel[],
): NotificationGroupModel[] =>
  Object.values(
    notifications.reduce(
      (groups: { [key: string]: NotificationGroupModel }, notification) => {
        const { data, id } = notification;
        const cardId = data && data.card && data.card.id;
        const prefix = cardId ? 'Card:' : 'Notification:';
        const normalizedId = (cardId || id).substring(id.indexOf(':') + 1);
        const groupId = prefix.concat(normalizedId);

        (
          groups[groupId] ||
          (groups[groupId] = {
            id: normalizedId,
            idGroup: groupId,
            notifications: [],
          })
        ).notifications.push(notification);

        return groups;
      },
      {},
    ),
  );
