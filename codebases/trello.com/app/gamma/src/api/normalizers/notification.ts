import {
  NotificationGroupModel,
  NotificationModel,
  ReactionModel,
} from 'app/gamma/src/types/models';
import { flatten } from 'underscore';

import {
  NotificationGroupResponse,
  NotificationGroupsResponse,
  NotificationResponse,
} from 'app/gamma/src/types/responses';
import { normalizeActionData } from './action';

import { normalizeAppCreator } from './app-creator';
import { normalizeBoard } from './board';
import { normalizeCard } from './card';
import { normalizeMember } from './member';
import { normalizeReaction } from './reaction';

import genericNormalizer, { normalizeDate } from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeNotification = genericNormalizer<
  NotificationResponse,
  NotificationModel
>(({ from, has, map }) => ({
  appCreator: has('appCreator', (app) =>
    app ? normalizeAppCreator(app) : undefined,
  ),
  data: has('data', normalizeActionData),
  date: has('date', normalizeDate),
  display: from('display'),
  id: from('id'),
  idAction: from('idAction'),
  memberCreator: has('memberCreator', (member) =>
    member ? normalizeMember(member) : undefined,
  ),
  idMemberCreator: from('idMemberCreator'),
  type: from('type'),
  unread: from('unread'),
  dateRead: from('dateRead'),
  isReactable: from('isReactable'),
}));

export const normalizeNotifications = (
  notifications: NotificationResponse[],
): NotificationModel[] => {
  return notifications.map((notification) =>
    normalizeNotification(notification),
  );
};

// eslint-disable-next-line @trello/no-module-logic
export const normalizeNotificationGroup = genericNormalizer<
  NotificationGroupResponse,
  NotificationGroupModel
>(({ from, has, map }) => ({
  id: has('id', (id) => id.substring(id.indexOf(':') + 1)),
  idGroup: from('id'),
  notifications: map('notifications', normalizeNotification),
  card: has('card', normalizeCard),
  board: has('card', (card) =>
    card.board ? normalizeBoard(card.board) : undefined,
  ),
}));

export const normalizeNotificationGroups = (
  notificationGroups: NotificationGroupsResponse,
): NotificationGroupModel[] => {
  return notificationGroups.map((notificationGroup) =>
    normalizeNotificationGroup(notificationGroup),
  );
};

export const normalizeReactionsFromNotificationGroups = (
  notificationGroups: NotificationGroupsResponse,
): ReactionModel[] => {
  return flatten(
    notificationGroups.map((notificationGroup) =>
      flatten(
        notificationGroup.notifications.map((notification) =>
          notification.reactions.map((reaction) => normalizeReaction(reaction)),
        ),
      ),
    ),
  );
};
