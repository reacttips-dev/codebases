import { default as setFeatureFlag } from './setFeatureFlag';
import type { FeatureName } from '../store/featureDefinitions';
import getStore from '../store/Store';
import { clearLocalStorageOverrides } from '../utils/overrides/localStorageOverrides';
import { getDefaultFlags } from '../utils/defaultFlags';

export default function resetFeatureFlags() {
    const defaultFlags = getDefaultFlags();
    for (let featureName of getStore().featureFlags.keys()) {
        setFeatureFlag(featureName as FeatureName, !!defaultFlags[featureName]);
    }
    clearLocalStorageOverrides();
}
