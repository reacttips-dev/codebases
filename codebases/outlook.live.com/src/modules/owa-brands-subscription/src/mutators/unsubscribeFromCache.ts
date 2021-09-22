import { mutatorAction } from 'satcheljs';
import brandSubscriptionStore from '../store/Store';
import { getBrandsSubscriptionsService } from '../index';
import { getSubscriptionFromCache } from '../selectors/subscriptionsCacheOperations';

export default mutatorAction('unsubscribeFromCache', (smtpAddress: string) => {
    const subscription = { ...getSubscriptionFromCache(smtpAddress) };
    if (subscription) {
        brandSubscriptionStore.subscriptions.delete(smtpAddress.toLowerCase());
        brandSubscriptionStore.unsubscribedSubscriptions.set(
            smtpAddress.toLowerCase(),
            subscription
        );
    } else {
        // If there is no item in Cache, maybe it got stale so reload the Cache
        getBrandsSubscriptionsService();
    }
});
