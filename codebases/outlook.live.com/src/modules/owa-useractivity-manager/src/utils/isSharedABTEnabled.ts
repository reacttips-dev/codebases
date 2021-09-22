import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

export function isSharedABTEnabled(): boolean {
    return !!(
        isBusiness() &&
        isFeatureEnabled('auth-sharedActivityBasedTimeout') &&
        getUserConfiguration().PolicySettings?.IsSharedActivityBasedTimeoutEnabled
    );
}
