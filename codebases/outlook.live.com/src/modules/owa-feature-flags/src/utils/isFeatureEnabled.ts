import getStore from '../store/Store';
import { areFeatureFlagsInitialized } from '../actions/initializeFeatureFlags';
import type { FeatureName } from '../store/featureDefinitions';
import * as trace from 'owa-trace';

export default function isFeatureEnabled(
    feature: FeatureName,
    dontThrowErrorIfNotInitiailzied?: boolean
): boolean {
    if (!areFeatureFlagsInitialized() && !process.env.JEST_WORKER_ID) {
        if (dontThrowErrorIfNotInitiailzied) {
            return false;
        }
        trace.errorThatWillCauseAlert(
            `Attempted to read ${feature} before feature flags were initialized.`
        );
    }

    return getStore().featureFlags.get(feature.toLowerCase()) || false;
}
