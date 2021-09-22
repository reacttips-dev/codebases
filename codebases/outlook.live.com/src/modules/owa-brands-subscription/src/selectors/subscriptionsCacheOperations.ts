import brandSubscriptionStore from '../store/Store';

function getSubscriptionFromCache(smtpAddress?: string) {
    if (smtpAddress && brandSubscriptionStore.subscriptions.has(smtpAddress.toLowerCase())) {
        return brandSubscriptionStore.subscriptions.get(smtpAddress.toLowerCase());
    }

    return null;
}

export { getSubscriptionFromCache };
