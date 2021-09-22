/* tslint:disable:forbid-import */
import { autorun } from 'mobx';
/* tslint:enable:forbid-import */
import isFeatureEnabled from './isFeatureEnabled';
import type { FeatureName } from '../store/featureDefinitions';

export default function initializeFeature(feature: FeatureName, initialization: () => void): void {
    if (isFeatureEnabled(feature)) {
        initialization();
    } else {
        // Set up an autorun to initialize if the feature is enabled during the session
        let autorunDisposer = autorun(() => {
            if (isFeatureEnabled(feature)) {
                initialization();
                autorunDisposer();
            }
        });
    }
}
