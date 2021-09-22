import {
    lazyAddUnreadCountNotificationDiagnostics,
    lazyAddUnreadCountSubscriptionDiagnostics,
} from 'owa-group-readunread-diagnostics';
import type UnreadItemNotificationPayload from 'owa-service/lib/contract/UnreadItemNotificationPayload';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import subscriptionParameters from 'owa-service/lib/factory/subscriptionParameters';
import {
    lazyGetChannelId,
    lazySubscribe,
    lazyUnsubscribe,
    NotificationSubscription,
} from 'owa-notification';
import { PerformanceDatapoint } from 'owa-analytics';
import { isGroupInFavorites } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { leftNavGroupsStore } from 'owa-group-left-nav';
import { MAX_GROUP_NODES_WHEN_COLLAPSED } from 'owa-group-left-nav/lib/utils/constants';
import updateGroupUnreadCount from 'owa-groups-shared-store/lib/utils/updateGroupUnreadCount';
import { subscribeToUnreadCountNotificationsUsingGql } from '../notifications/subscribeToUnreadCountNotificationsUsingGql';

interface GroupSubscriptionData {
    notificationSubscription: NotificationSubscription;
    firstNotificationReceived: boolean;
    unreadCountDataPoint: PerformanceDatapoint;
}

const groupIdToSubscriptionMap: { [id: string]: GroupSubscriptionData } = {};

function onUnreadCountNotificationCallback(notification: UnreadItemNotificationPayload): void {
    const groupId = getGroupIdFromNotification(notification.id);

    // Tracking Unread Count notifications for the Diagnostics Panel
    lazyAddUnreadCountNotificationDiagnostics
        .import()
        .then(addUnreadCountNotificationDiagnosticsMutator =>
            addUnreadCountNotificationDiagnosticsMutator(groupId, notification)
        );

    // Only update on notification that contains new UnreadCount information
    if (notification.EventType.toString() == '0') {
        const groupSubscriptionData = groupIdToSubscriptionMap[groupId];
        // ensure that we are still tracking notifications for this group
        if (groupSubscriptionData) {
            updateGroupUnreadCount(groupId.toLowerCase(), notification.UnreadCount);
            if (!groupSubscriptionData.firstNotificationReceived) {
                groupSubscriptionData.unreadCountDataPoint.end();
                groupSubscriptionData.unreadCountDataPoint = null;
                groupSubscriptionData.firstNotificationReceived = true;
            }
        }
    }
}

export function subscribeToGroupsUnreadNotifications(): void {
    if (isFeatureEnabled('grp-unreadCountTop5AndFavorites')) {
        // When this flight is on, we will subscribe for notifications only for the top 5 groups
        // and for groups that have been favorited
        if (isFeatureEnabled('grp-groupunreadcountnotification-gql')) {
            leftNavGroupsStore.myOrgGroups
                .filter((groupId, index) => {
                    return index < MAX_GROUP_NODES_WHEN_COLLAPSED || isGroupInFavorites(groupId);
                })
                .forEach(groupId => {
                    subscribeToUnreadCountNotificationsUsingGql(groupId);
                });
        } else {
            leftNavGroupsStore.myOrgGroups
                .filter((groupId, index) => {
                    return index < MAX_GROUP_NODES_WHEN_COLLAPSED || isGroupInFavorites(groupId);
                })
                .forEach(groupId => {
                    subscribeToUnreadNotifications(groupId);
                });
        }
    } else {
        subscribeToAllGroupsUnreadNotifications();
    }
}

export function subscribeToAllGroupsUnreadNotifications(): void {
    leftNavGroupsStore.myOrgGroups.forEach(groupId => {
        subscribeToUnreadNotifications(groupId);
    });
}

export function subscribeToUnreadNotifications(groupId: string): void {
    groupId = groupId.toLowerCase();
    if (shouldSubscribeToNotifications(groupId)) {
        lazyGetChannelId.import().then(getChannelId => {
            const unreadSubscriptionParameters: SubscriptionParameters = subscriptionParameters({
                NotificationType: 'UnreadCountNotification',
                ChannelId: getChannelId(),
                MailboxId: groupId,
            });

            const subscription: NotificationSubscription = {
                subscriptionId: generateSubscriptionId(groupId),
                requiresExplicitSubscribe: true,
                subscriptionParameters: unreadSubscriptionParameters,
            };

            // subscribe and store the subscription object
            lazySubscribe.importAndExecute(subscription, onUnreadCountNotificationCallback);
            const groupSubscriptionData: GroupSubscriptionData = {
                notificationSubscription: subscription,
                firstNotificationReceived: false,
                unreadCountDataPoint: new PerformanceDatapoint('UnreadCountNotification', {
                    logEvery: isFeatureEnabled('ring-dogfood') ? 1 : 20,
                }),
            };

            groupIdToSubscriptionMap[groupId] = groupSubscriptionData;

            lazyAddUnreadCountSubscriptionDiagnostics
                .import()
                .then(addUnreadCountSubscriptionDiagnosticsMutator =>
                    addUnreadCountSubscriptionDiagnosticsMutator(groupId, subscription, false)
                );
        });
    }
}

export function unsubscribeFromUnreadNotifications(groupId: string): void {
    groupId = groupId.toLowerCase();
    const groupSubscriptionData: GroupSubscriptionData = groupIdToSubscriptionMap[groupId];
    if (groupSubscriptionData) {
        const subscription = groupSubscriptionData.notificationSubscription;
        if (subscription) {
            lazyUnsubscribe.importAndExecute(subscription, onUnreadCountNotificationCallback);
            delete groupIdToSubscriptionMap[groupId];

            lazyAddUnreadCountSubscriptionDiagnostics
                .import()
                .then(addUnreadCountSubscriptionDiagnosticsMutator =>
                    addUnreadCountSubscriptionDiagnosticsMutator(groupId, subscription, true)
                );
        }
    }
}

function generateSubscriptionId(groupId: string): string {
    return 'UnreadCountNotification_' + groupId;
}

function getGroupIdFromNotification(notificationId: string): string {
    return notificationId.replace('UnreadCountNotification_', '');
}

// subscribe if we don't already have a subscription
function shouldSubscribeToNotifications(groupId: string): boolean {
    return !groupIdToSubscriptionMap[groupId];
}
