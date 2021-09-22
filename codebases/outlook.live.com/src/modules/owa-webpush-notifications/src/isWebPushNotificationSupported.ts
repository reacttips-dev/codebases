import { isFeatureEnabled } from 'owa-feature-flags';
import {
    isBrowserChrome,
    isBrowserFirefox,
    isBrowserEDGECHROMIUM,
    isBrowserSafari,
} from 'owa-user-agent';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { isCurrentCultureRightToLeft } from 'owa-localize';

export const isWebPushNotificationSupported = (windowObj: Window): boolean => {
    if (
        !isFeatureEnabled('fwk-webPushNotification') &&
        !isFeatureEnabled('fwk-webPushNotificationV2')
    ) {
        return false;
    }
    if (
        !windowObj.navigator ||
        windowObj.navigator.serviceWorker == null ||
        windowObj.PushManager == null
    ) {
        return false;
    }
    return (
        (isBrowserChrome() ||
            isBrowserFirefox() ||
            (isFeatureEnabled('fwk-webPushNotificationExtended') &&
                (isBrowserEDGECHROMIUM() || isBrowserSafari()))) &&
        !isCurrentCultureRightToLeft() &&
        (getOwaWorkload() == OwaWorkload.Mail || getOwaWorkload() == OwaWorkload.Calendar)
    );
};
