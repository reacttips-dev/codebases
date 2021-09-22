import { isFeatureEnabled } from 'owa-feature-flags';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';

export function isTrieCacheEnabled(): boolean {
    if (isBrowserIE()) {
        // We do not support IE browser due to some exceptions being thrown
        return false;
    }

    return (
        isFeatureEnabled('rp-cacheFirstPeopleTrieSize300') ||
        isFeatureEnabled('rp-cacheFirstPeopleTrieSize500') ||
        isFeatureEnabled('rp-cacheFirstPeopleTrieSize700') ||
        isFeatureEnabled('rp-peopleTrieOnTimeoutLow') ||
        isFeatureEnabled('rp-peopleTrieOnTimeoutMed') ||
        isFeatureEnabled('rp-peopleTrieOnTimeoutHigh')
    );
}
