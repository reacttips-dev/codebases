import { isFeatureEnabled } from 'owa-feature-flags';

export default function isLinkedInViewProfileFeatureFlagEnabled(): boolean {
    return (
        isFeatureEnabled('rp-linkedInViewProfile') || isFeatureEnabled('rp-linkedInViewProfileV1_1')
    );
}
