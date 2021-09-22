import { lazyGetChannelId, lazySubscribe } from 'owa-notification';
import subscriptionParameters from 'owa-service/lib/factory/subscriptionParameters';
import type GroupAssociationNotificationPayload from './GroupAssociationNotificationPayload';

export default function subscribe(
    callback: (this: void, payload: GroupAssociationNotificationPayload) => void
) {
    lazyGetChannelId.import().then(getChannelId => {
        lazySubscribe.importAndExecute(
            {
                subscriptionId: 'GroupAssociationNotification',
                requiresExplicitSubscribe: true,
                subscriptionParameters: subscriptionParameters({
                    NotificationType: 'GroupAssociationNotification',
                    ChannelId: getChannelId(),
                }),
            },
            callback
        );
    });
}
