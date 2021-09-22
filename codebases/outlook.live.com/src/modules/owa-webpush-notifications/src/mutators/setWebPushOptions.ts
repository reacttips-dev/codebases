import { default as updateWebPushOptions } from '../actions/updateWebPushOptions';
import { mutator } from 'satcheljs';
import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    WebPushNotificationsOptions,
} from 'owa-outlook-service-options';

export const setWebPushOptions = mutator(
    updateWebPushOptions,
    ({ enabled, enabledTimeInUTCMs }) => {
        let webPushOptions = getOptionsForFeature<WebPushNotificationsOptions>(
            OwsOptionsFeatureType.WebPushNotifications
        );
        webPushOptions.enabled = enabled;
        webPushOptions.enabledTimeInUTCMs = enabledTimeInUTCMs;
    }
);
