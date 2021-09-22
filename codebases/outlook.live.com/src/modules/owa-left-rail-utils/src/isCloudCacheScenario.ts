import { isFeatureEnabled } from 'owa-feature-flags';
import { IsPremiumConsumerUser, IsShadowMailboxUser } from 'owa-mail-ads-shared/lib/sharedAdsUtils';
import isIndexedPath from 'owa-url/lib/isIndexedPath';

/**
 * Check if its a Cloud cache scenario
 */
export function isCloudCacheScenario() {
    return (
        isFeatureEnabled('auth-cloudCache') &&
        (IsPremiumConsumerUser() || IsShadowMailboxUser()) &&
        isIndexedPath()
    );
}
