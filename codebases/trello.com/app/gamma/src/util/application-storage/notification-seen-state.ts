/* eslint-disable @trello/disallow-filenames */
import { TrelloStorage } from '@trello/storage';
import { NotificationsCountModel } from 'app/gamma/src/types/models';
import { getLastMemberId } from '../last-session';

const NOTIFICATION_SEEN_STATE_KEY_PREFIX = 'NotificationsSeenState';

export interface NotificationSeenState {
  lastSeenNotificationGroup: NotificationsCountModel;
}

const initialState: NotificationSeenState = {
  lastSeenNotificationGroup: {},
};

export const getNotificationSeenStateKey = () => {
  const idMe = getLastMemberId();

  return `${NOTIFICATION_SEEN_STATE_KEY_PREFIX}-${idMe}`;
};

export const getNotificationSeenStateGroupCount = (): NotificationsCountModel => {
  const idMe = getLastMemberId();
  if (!TrelloStorage.isEnabled() || !idMe) {
    return initialState.lastSeenNotificationGroup;
  }

  const key = getNotificationSeenStateKey();
  const notificationSeenState = TrelloStorage.get(key);

  if (!notificationSeenState) {
    TrelloStorage.set(key, initialState);

    return initialState.lastSeenNotificationGroup;
  }

  return notificationSeenState.lastSeenNotificationGroup;
};

// We take the current members NotificationsCountModel and
// store this in localstorage, this is expected to happen
// when the member opens the notification pane so whatever
// the count is at the time of opening the pane is their
// 'seen' notifications, which are then used to compare to
// their actual notification count (from the sever) to see
// if there are any notifications they haven't seen.
export const setNotificationSeenStateGroupCount = (
  value: NotificationsCountModel,
) => {
  const idMe = getLastMemberId();
  if (!TrelloStorage.isEnabled() || !idMe) {
    return;
  }

  const key = getNotificationSeenStateKey();
  TrelloStorage.set(key, {
    ...(TrelloStorage.get(key) || initialState),
    lastSeenNotificationGroup: value,
  });
};
