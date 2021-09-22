import * as optionsLoadActions from '../actions/applyDefaultOptionsOnLoadFail';
import { OwsOptionsFeatureType, setExtendedOptionValue } from 'owa-outlook-service-option-store';
import { orchestrator } from 'satcheljs';

/**
 * Add only the options features where the values are ok to have
 * when the call to Load option fails
 *
 * We don't want to aggravate users by potentially having it
 * enabled or potentially non-default values after they explicitly disabled it.
 */

const featuresToUseDefault: OwsOptionsFeatureType[] = [OwsOptionsFeatureType.SurfaceActions];

orchestrator(optionsLoadActions.applyDefaultOptionsOnLoadFail, msg => {
    const defaultOptions = msg.defaultOptions;
    featuresToUseDefault.forEach(featureKey => {
        if (defaultOptions[featureKey]) {
            setExtendedOptionValue(
                Number(featureKey as unknown) as OwsOptionsFeatureType,
                defaultOptions[featureKey]
            );
        }
    });
});
