import {
    getOptionsForFeature,
    AmpDeveloperOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

/**
 * Is Amp enabled
 */
export default function isAmpEnabled(): boolean {
    const ampDeveloperOptions = getOptionsForFeature<AmpDeveloperOptions>(
        OwsOptionsFeatureType.AmpDeveloper
    );

    return isConsumer() && isFeatureEnabled('rp-amp') && ampDeveloperOptions.enabled;
}
