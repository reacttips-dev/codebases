import {
    OwsOptionsFeatureType,
    OwsOptionsBase,
    getOptionsForFeature,
} from 'owa-outlook-service-option-store';
import loadOptions from '../actions/loadOptions';

/**
 * This function is meant for when you need values from the server, not default values,
 * and you don't mind waiting/blocking until said values are loaded.
 */
export default async function getServerOptionsForFeature<T extends OwsOptionsBase>(
    feature: OwsOptionsFeatureType
): Promise<T> {
    // Load options caches its promise, so it won't make multiple concurrent service requests
    await loadOptions();

    return getOptionsForFeature<T>(feature);
}
