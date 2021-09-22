import { isFeatureEnabled } from 'owa-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isEnvironmentAirGap } from 'owa-metatags';

export default function isFeedbackEnabled() {
    const { PolicySettings, IsConsumerChild } = getUserConfiguration();
    return (
        isFeatureEnabled('core-feedback') &&
        !isEnvironmentAirGap() &&
        PolicySettings?.FeedbackEnabled &&
        !IsConsumerChild
    );
}
