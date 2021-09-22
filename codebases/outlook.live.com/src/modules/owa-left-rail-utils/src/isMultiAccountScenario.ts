import { isFeatureEnabled } from 'owa-feature-flags';
import { isBusiness } from 'owa-session-store';

/**
 * Check if its a MultiAccount scenario
 */
export function isMultiAccountScenario() {
    return isFeatureEnabled('mail-oneView') && isBusiness();
}
