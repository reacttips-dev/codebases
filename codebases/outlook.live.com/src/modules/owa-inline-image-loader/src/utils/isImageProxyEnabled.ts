import {
    ExternalImagesOptions,
    getOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import { getUserConfiguration, isConsumer } from 'owa-session-store';

/**
 * This function returns the value of External Images setting.
 */
export default function isImageProxyEnabled(): boolean {
    let imageProxyEnabled = true;
    if (isConsumer()) {
        // For consumer, there is externalImagesSelectedOption user option for it
        // The value of externalImagesSelectedOption is defined as follows (ExternalImagesOptionType):
        // 0 - Display
        // 1 - Block
        const userOptions = getOptionsForFeature<ExternalImagesOptions>(
            OwsOptionsFeatureType.ExternalImages
        );

        // externalImagesSelectedOption may not be available for first 10 GCI
        // which happens right after boot. In that case, it will be null.
        // Fall back to to use image proxy when the option is not available.
        imageProxyEnabled =
            userOptions.externalImagesSelectedOption === null ||
            userOptions.externalImagesSelectedOption === 0;
    } else {
        // For enterprise, there is a mailbox policy
        // When ExternalImageProxyEnabled is not set, just default it to be true
        const policySettings = getUserConfiguration().PolicySettings;
        imageProxyEnabled =
            policySettings.ExternalImageProxyEnabled !== undefined
                ? policySettings.ExternalImageProxyEnabled
                : true;
    }

    return imageProxyEnabled;
}
