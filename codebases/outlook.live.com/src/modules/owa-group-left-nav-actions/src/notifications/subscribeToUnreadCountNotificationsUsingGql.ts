import { getApolloClient } from 'owa-apollo';
import { ObservableSubscription } from '@apollo/client';
import { SubscribeToUnreadCountNotificationsDocument } from '../graphql/__generated__/subscribeToUnreadCountNotifications.interface';
import { handleUnreadCountNotification } from '../actions/unreadCountNotificationHandler';
import * as trace from 'owa-trace';
import { lazyAddUnreadCountSubscriptionDiagnostics } from 'owa-group-readunread-diagnostics';
import { lazyGetChannelId, NotificationSubscription } from 'owa-notification';
import SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import subscriptionParameters from 'owa-service/lib/factory/subscriptionParameters';
import { PerformanceDatapoint } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface GroupSubscriptionData {
    notificationSubscription: NotificationSubscription;
    firstNotificationReceived: boolean;
    unreadCountDataPoint: PerformanceDatapoint;
}

const groupIdToSubscriptionMap: { [id: string]: GroupSubscriptionData } = {};
const groupIdToObservableSubscriptionMap: { [id: string]: ObservableSubscription } = {};

export async function subscribeToUnreadCountNotificationsUsingGql(
    groupId: string
): Promise<ObservableSubscription> {
    const channelId = (await lazyGetChannelId.import())();
    const unreadSubscriptionParameters: SubscriptionParameters = subscriptionParameters({
        NotificationType: 'UnreadCountNotification',
        ChannelId: channelId,
        MailboxId: groupId,
    });

    const subscription: NotificationSubscription = {
        subscriptionId: generateSubscriptionId(groupId),
        requiresExplicitSubscribe: true,
        subscriptionParameters: unreadSubscriptionParameters,
    };

    if (shouldSubscribeToNotifications(groupId)) {
        const apolloClient = getApolloClient();
        const apolloSubscription = apolloClient.subscribe({
            query: SubscribeToUnreadCountNotificationsDocument,
            variables: {
                subscriptionId: generateSubscriptionId(groupId),
                mailboxSmtpAddress: groupId,
            },
        });

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

        // This subscribe returns an object we can use to unsubscribe
        const observableSubscription: ObservableSubscription = apolloSubscription.subscribe({
            next: payload =>
                handleUnreadCountNotification(
                    payload.data.subscribeToUnreadCountNotifications,
                    groupIdToSubscriptionMap[
                        getGroupIdFromNotification(
                            payload.data.subscribeToUnreadCountNotifications.id
                        )
                    ]
                ),
            error: err => {
                trace.trace.info(`unread count notification error ${err}`);
            },
        });
        groupIdToObservableSubscriptionMap[groupId] = observableSubscription;
        return observableSubscription;
    }
    return groupIdToObservableSubscriptionMap[groupId];
}

export function unsubscribeToUnreadCountNotificationsUsingGql(groupId: string): void {
    // unsubscribe from this gql subscription
    groupId = groupId.toLowerCase();
    const subscription = groupIdToObservableSubscriptionMap[groupId];
    if (subscription) {
        const groupSubscriptionData: GroupSubscriptionData = groupIdToSubscriptionMap[groupId];
        subscription.unsubscribe();
        delete groupIdToObservableSubscriptionMap[groupId];
        delete groupIdToSubscriptionMap[groupId];
        lazyAddUnreadCountSubscriptionDiagnostics
            .import()
            .then(addUnreadCountSubscriptionDiagnosticsMutator =>
                addUnreadCountSubscriptionDiagnosticsMutator(
                    groupId,
                    groupSubscriptionData.notificationSubscription,
                    true
                )
            );
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
