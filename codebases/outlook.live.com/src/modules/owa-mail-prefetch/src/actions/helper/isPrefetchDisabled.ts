import { isFeatureEnabled } from 'owa-feature-flags';

export function isPrefetchDisabled() {
    return isFeatureEnabled('fwk-prefetch-data-off');
}
