import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function isHxForksEnabled(): boolean {
    return (
        isFeatureEnabled('mon-rp-unstackedConversation') &&
        isFeatureEnabled('mon-conv-useHx') &&
        isHostAppFeatureEnabled('nativeResolvers')
    );
}
