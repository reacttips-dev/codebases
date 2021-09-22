import getDefaultOptions, { DefaultOptionsType } from '../data/defaultOptions';
import {
    assignOptionValue,
    getStore,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-option-store';

export default function applyDefaultOptions(
    defaultOptions: DefaultOptionsType = getDefaultOptions()
) {
    Object.keys(getStore().options).forEach(featureKey => {
        if (!getStore().options[featureKey].lastModifiedDateTime) {
            // No value was loaded from the PrimeSettings in session data response or in the OutlookOptions
            // request response. Apply the default option if it exists
            if (defaultOptions[featureKey]) {
                const newFeatureKey = Number(featureKey as unknown) as OwsOptionsFeatureType;
                assignOptionValue(newFeatureKey, defaultOptions[featureKey]);
            }
        }
    });
}
