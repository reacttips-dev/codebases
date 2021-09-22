import { isFeatureEnabled } from 'owa-feature-flags';

export default function isFeatureDataLoggingEnabled(): boolean {
    return isFeatureEnabled('rp-cacheFirstFeatureDataLogging');
}
