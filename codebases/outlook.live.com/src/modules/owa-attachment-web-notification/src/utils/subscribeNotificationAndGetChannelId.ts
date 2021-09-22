import { getGuid } from 'owa-guid';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';
import {
    lazyGetChannelId,
    lazySubscribe,
    lazyUnsubscribe,
    NotificationCallback,
    NotificationSubscription,
} from 'owa-notification';

export default async function subscribeNotificationAndGetChannelId<
    T extends NotificationPayloadBase
>(
    notificationHandler: (notification: T) => boolean,
    existingSubscriptionId?: string | null
): Promise<[string, NotificationSubscription, NotificationCallback, string]> {
    const subscriptionId: string = existingSubscriptionId || getGuid();
    const subscription: NotificationSubscription = {
        subscriptionId: subscriptionId,
        requiresExplicitSubscribe: false,
        subscriptionParameters: null,
        noSubscriptionFailureReload: true,
    };

    const handleAttachmentNofication: NotificationCallback = (notification: T): void => {
        if (notificationHandler(notification)) {
            lazyUnsubscribe.importAndExecute(subscription, handleAttachmentNofication);
        }
    };

    (await lazySubscribe.import())(subscription, handleAttachmentNofication);
    const channelId = (await lazyGetChannelId.import())();
    return [subscriptionId, subscription, handleAttachmentNofication, channelId];
}
