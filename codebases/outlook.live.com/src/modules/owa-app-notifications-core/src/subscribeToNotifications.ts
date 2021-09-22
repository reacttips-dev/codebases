import { lazySubscribe, NotificationSubscription, NotificationCallback } from 'owa-notification';
import reminderNotificationAction from './actions/reminderNotificationAction';
import newMailNotificationAction from './actions/newMailNotificationAction';
import socialActivityNotificationAction from './actions/socialActivityNotificationAction';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type NotificationType from 'owa-service/lib/contract/NotificationType';
import SubscriptionMailboxType from 'owa-service/lib/contract/SubscriptionMailboxType';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { isFeatureEnabled } from 'owa-feature-flags';
import reactionNotificationAction from './actions/reactionNotificationAction';
import activityFeedNotificationAction from './actions/activityFeedNotificationAction';

let isSubscriptionInitialized = false;

export function subscribeToNotifications() {
    if (isSubscriptionInitialized) {
        return;
    }
    isSubscriptionInitialized = true;

    lazySubscribe.importAndExecute(
        createSubscription('ReminderNotification', 'ReminderNotifications'),
        notification => reminderNotificationAction(notification, null)
    );

    if (getOwaWorkload() == OwaWorkload.Mail) {
        lazySubscribe.importAndExecute(
            createSubscription('NewMailNotification'),
            newMailNotificationAction
        );
    }

    if (!isConsumer()) {
        subscribeToSocialActivityNotification(
            false /* isOpx */,
            reactionNotificationAction,
            socialActivityNotificationAction,
            activityFeedNotificationAction
        );
    }
}

export function subscribeToSocialActivityNotification(
    isOpx: boolean,
    reactionCallback: NotificationCallback,
    socialActivityCallBack?: NotificationCallback,
    activityFeedNotificationCallBack?: NotificationCallback
) {
    if (isOpx || getOwaWorkload() == OwaWorkload.Mail) {
        if (isFeatureEnabled('auth-reactionNotifications') && isFeatureEnabled('rp-reactions')) {
            lazySubscribe.importAndExecute(
                createSubscription('ReactionNotification'),
                reactionCallback
            );
        } else {
            lazySubscribe.importAndExecute(
                createSubscription('SocialActivityNotification'),
                socialActivityCallBack ?? reactionCallback
            );
        }
    }

    if (isFeatureEnabled('auth-activityFeedPushModel') && activityFeedNotificationCallBack) {
        lazySubscribe.importAndExecute(
            createSubscription('ActivityFeedNotification'),
            activityFeedNotificationCallBack
        );
    }
}

export function subscribeToConnectedAccountNotifications(
    connectedAccount: string,
    connectedAccountType: 'Outlook' | 'Google'
) {
    lazySubscribe.importAndExecute(
        {
            subscriptionId: `ReminderNotification-${connectedAccount}`,
            requiresExplicitSubscribe: true,
            subscriptionParameters: {
                NotificationType: 'ReminderNotification',
                MailboxId: connectedAccount,
                MailboxType:
                    connectedAccountType === 'Google'
                        ? SubscriptionMailboxType.GmailSecondaryMailbox
                        : SubscriptionMailboxType.ConsumerSecondaryMailbox,
            },
        },
        notification => reminderNotificationAction(notification, connectedAccount)
    );
}

function createSubscription(
    notificationType: NotificationType,
    id?: string
): NotificationSubscription {
    return {
        subscriptionId: id || notificationType,
        requiresExplicitSubscribe: true,
        subscriptionParameters: {
            NotificationType: notificationType,
        },
    };
}
