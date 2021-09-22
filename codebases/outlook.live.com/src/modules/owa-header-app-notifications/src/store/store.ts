import { createStore } from 'satcheljs';
import type InAppNotificationViewState from './schema/InAppNotificationViewState';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';

var initialiState: InAppNotificationViewState = {
    newMailNotifications: [],
    newMailNotificationsSentToHost: new Map<string, NewMailNotificationPayload>(),
    likeNotifications: [],
    reactionNotifications: [],
    reminders: [],
    remindersHost: [],
    showReminders: false,
    showAutomaticRepliesNotification: true,
    forwardingNotice: {
        showForwardingNotice: false,
    },
};

export default createStore<InAppNotificationViewState>('inAppNotifications', initialiState);
