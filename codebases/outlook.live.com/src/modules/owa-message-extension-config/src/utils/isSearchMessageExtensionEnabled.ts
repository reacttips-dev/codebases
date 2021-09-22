import { isFeatureEnabled } from 'owa-feature-flags';
import isDeveloperLicense from './isDeveloperLicense';
import isProdEnv from './isProdEnv';

/**
 * Method to check whether message extensions are enabled or not.
 * @returns boolean
 */
export default function isSearchMessageExtensionEnabled(): boolean {
    if (isFeatureEnabled('me-search-global')) {
        if (isFeatureEnabled('me-search-publicrelease')) {
            return true;
        }
        if (isProdEnv() && isDeveloperLicense()) {
            return true;
        }
    }
    return false;
}
