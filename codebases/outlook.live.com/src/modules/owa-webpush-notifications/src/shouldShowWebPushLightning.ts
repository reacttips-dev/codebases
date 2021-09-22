import { isWebPushNotificationSupported } from './isWebPushNotificationSupported';
import { getLocalWebPushUserSettingStore } from './store/store';
import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';

export const MAX_UNIQUEDAYS_SESSION_COUNT_FOR_LIGHTNING: number = 3;

export function shouldShowWebPushLightning(
    windowObj: Window,
    options: WebPushNotificationsOptions
): boolean {
    let show = false;
    // If the feature is supported and user has never taken action on previous prompts.
    if (isWebPushNotificationSupported(windowObj) && options.enabledTimeInUTCMs == null) {
        show =
            getLocalWebPushUserSettingStore().uniqueDaysSessionCount >=
            MAX_UNIQUEDAYS_SESSION_COUNT_FOR_LIGHTNING;
    }

    return show;
}
