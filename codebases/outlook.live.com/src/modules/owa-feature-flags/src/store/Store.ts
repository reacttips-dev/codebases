import type FeatureFlagsStore from './schema/FeatureFlagsStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { FeatureName } from './featureDefinitions';

let featureFlagsStore: FeatureFlagsStore = {
    featureFlags: new ObservableMap<FeatureName, boolean>(),
};

export default createStore<FeatureFlagsStore>('featureFlags', featureFlagsStore);
