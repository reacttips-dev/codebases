import getStore from '../store/Store';
import { action, mutator } from 'satcheljs';
import { ObservableMap } from 'mobx';
import getUrlOverrides from '../utils/overrides/getUrlOverrides';
import { setLogicalRing } from 'owa-config/lib/getLogicalRing';
import calculateLogicalRing from '../utils/calculateLogicalRing';
import { getLocalStorageOverrides } from '../utils/overrides/localStorageOverrides';
import { setDefaultFlags } from '../utils/defaultFlags';
import { getFlagsEnabledByRing } from '../utils/getFlagsEnabledByRing';

export const FEATURES_QUERYSTRING_PARAMETER_NAME = 'features';
export const FLIGHT_DEVTOOLS_NAME = 'fwk-devtools';

let featureFlagsInitialized: boolean = false;
export function areFeatureFlagsInitialized(): boolean {
    return featureFlagsInitialized;
}

export const INITIALIZE_FEATURE_FLAGS_ACTION_NAME = 'initializeFeatureFlags';

const initializeFeatureFlags = action(
    INITIALIZE_FEATURE_FLAGS_ACTION_NAME,
    (flagsFromService?: string[]) => {
        const flagsFromServiceObject = (flagsFromService || []).reduce((agg, flagFromService) => {
            agg[flagFromService.toLowerCase()] = true;
            return agg;
        }, {});
        const logicalRing = calculateLogicalRing(feature => flagsFromServiceObject[feature]);
        addOverrides(flagsFromServiceObject, getFlagsEnabledByRing(logicalRing));
        setLogicalRing(logicalRing);
        setDefaultFlags(makeDefaultFlags(flagsFromServiceObject));
        if (logicalRing == 'Dogfood') {
            addOverrides(flagsFromServiceObject, getLocalStorageOverrides());
        }
        if (flagsFromServiceObject[FLIGHT_DEVTOOLS_NAME]) {
            addOverrides(
                flagsFromServiceObject,
                getUrlOverrides(FEATURES_QUERYSTRING_PARAMETER_NAME)
            );
        }

        return flagsFromServiceObject;
    }
);

function addOverrides(
    flags: { [feature: string]: boolean },
    overrides: { [feature: string]: boolean }
): void {
    for (let key of Object.keys(overrides)) {
        flags[key.toLowerCase()] = overrides[key];
    }
}

function makeDefaultFlags(flags: {}) {
    let defaultFlags = {};
    for (let key of Object.keys(flags)) {
        defaultFlags[key] = flags[key];
    }
    return defaultFlags;
}

mutator(initializeFeatureFlags, initialFlagsWithOverrides => {
    // Apply initial state w/ calculated overrides
    getStore().featureFlags = new ObservableMap<string, boolean>(initialFlagsWithOverrides);
    featureFlagsInitialized = true;
});

export default initializeFeatureFlags;
