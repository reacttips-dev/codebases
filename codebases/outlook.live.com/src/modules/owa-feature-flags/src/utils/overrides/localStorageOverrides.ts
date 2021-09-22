import parseOverrideString from './parseOverrideString';
import type FeatureOverride from '../../store/schema/FeatureOverride';
import { getItem, removeItem, setItem } from 'owa-local-storage';
import { getDefaultFlags } from '../defaultFlags';

const FEATURE_OVERRIDE_LOCAL_STORAGE_KEY = 'featureOverrides';

export function getLocalStorageOverrides() {
    const localStorageOverrides = getItem(window, FEATURE_OVERRIDE_LOCAL_STORAGE_KEY);

    if (localStorageOverrides) {
        return parseOverrideString(localStorageOverrides);
    }

    return {};
}

export function clearLocalStorageOverrides() {
    removeItem(window, FEATURE_OVERRIDE_LOCAL_STORAGE_KEY);
}

export function updateLocalStorageOverrides(overrides: FeatureOverride[]) {
    // Get overrides from local storage (or empty array if it doesn't exist yet).
    const localStorageOverrides = getItem(window, FEATURE_OVERRIDE_LOCAL_STORAGE_KEY);
    let allOverrides = localStorageOverrides ? localStorageOverrides.split(',') : [];

    for (const override of overrides) {
        // Construct key to set in local storage value for this feature override.
        const normalizedFeatureName = override.name.toLowerCase();
        const overrideKey = override.isEnabled
            ? normalizedFeatureName
            : `-${normalizedFeatureName}`;

        /**
         * Determine if feature is enabled by default for user and compare that
         * value to the value of the update. If they are the same, it doesn't
         * need to be written to localStorage.
         *
         * "isEnabledByDefault" can be undefined which is they the condition is
         * constructed as-is.
         */
        const isEnabledByDefault = getDefaultFlags()[normalizedFeatureName];
        const shouldBeStored = override.isEnabled === !isEnabledByDefault;

        // Remove current override from list of overrides (if it exists).
        const featureRegex = new RegExp(`^-?${normalizedFeatureName}$`, 'i');
        allOverrides = allOverrides.filter(feature => {
            return !featureRegex.test(feature);
        });

        // Add current override to list of overrides (if value differs from default).
        if (shouldBeStored) {
            allOverrides.push(overrideKey);
        }
    }

    setItem(window, FEATURE_OVERRIDE_LOCAL_STORAGE_KEY, allOverrides.join(','));
}
