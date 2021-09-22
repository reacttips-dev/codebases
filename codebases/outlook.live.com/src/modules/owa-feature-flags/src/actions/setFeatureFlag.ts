import type { FeatureName } from '../store/featureDefinitions';
import getStore from '../store/Store';
import { updateLocalStorageOverrides } from '../utils/overrides/localStorageOverrides';
import { orchestrator, action, mutator } from 'satcheljs';

let setFeatureFlag = action('setFeatureFlag<T>', (feature: FeatureName, isOn: boolean) => ({
    feature: feature,
    isOn: isOn,
}));

mutator(setFeatureFlag, function (actionMessage) {
    // Set the boolean in the store so product can use
    getStore().featureFlags.set(actionMessage.feature.toLowerCase(), actionMessage.isOn);
});

orchestrator(setFeatureFlag, function (actionMessage) {
    let feature = actionMessage.feature;
    let isOn = actionMessage.isOn;

    // Store or remove value in/from local storage that will keep settings sticky per machine
    updateLocalStorageOverrides([
        {
            name: feature.toLowerCase(),
            isEnabled: isOn,
        },
    ]);
});

export default setFeatureFlag;
