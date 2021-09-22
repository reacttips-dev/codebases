import type { ObservableMap } from 'mobx';
import getFeatureFlagsStore from './store/Store';

import './mutators/featureFlagMutators';

export let featureFlags: ObservableMap<string, boolean> = getFeatureFlagsStore().featureFlags;
export { default as extractFlightsFromSettings } from './utils/extractFlightsFromSettings';
export { default as getFeatureFlag } from './utils/getFeatureFlag';
export { default as initializeFeature } from './utils/initializeFeature';
export { default as initializeFeatureFlags } from './actions/initializeFeatureFlags';
export { default as isFeatureEnabled } from './utils/isFeatureEnabled';
export { default as setFeatureFlag } from './actions/setFeatureFlag';
export { default as resetFeatureFlags } from './actions/resetFeatureFlags';
export type { FeatureName } from './store/featureDefinitions';
export { updateLocalStorageOverrides } from './utils/overrides/localStorageOverrides';
export { default as updateActiveFlights } from './actions/updateActiveFlights';
export { getDefaultFeatureFlags } from './actions/getDefaultFeatureFlags';
export { checkUberFlight, checkUserTypeFlight } from './utils/integrityChecks';
export { getDefaultFlags } from './utils/defaultFlags';
export { getEnabledFlightsWithPrefix } from './utils/getEnabledFlightsWithPrefix';
