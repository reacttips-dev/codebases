import { mutatorAction } from 'satcheljs';
import type GetBrandsSubscriptionsServiceResponse from '../store/schema/GetBrandsSubscriptionsServiceResponse';
import brandSubscriptionStore from '../store/Store';

export default mutatorAction(
    'populateSubscriptionStore',
    (brandsSubscriptionsServiceResponse: GetBrandsSubscriptionsServiceResponse) => {
        brandsSubscriptionsServiceResponse.subscriptions.forEach(subscription => {
            if (!subscription?.smtpInfo?.smtpAddress) {
                return;
            }

            brandSubscriptionStore.subscriptions.set(
                subscription.smtpInfo.smtpAddress.toLowerCase(),
                subscription
            );
        });

        brandsSubscriptionsServiceResponse.unsubscribedSubscriptions.forEach(
            unsubscribedSubscription => {
                if (!unsubscribedSubscription?.smtpInfo?.smtpAddress) {
                    return;
                }

                brandSubscriptionStore.unsubscribedSubscriptions.set(
                    unsubscribedSubscription.smtpInfo.smtpAddress.toLowerCase(),
                    unsubscribedSubscription
                );
            }
        );
    }
);
