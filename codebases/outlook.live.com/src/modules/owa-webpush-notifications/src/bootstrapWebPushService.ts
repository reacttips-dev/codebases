import { default as disableWebPushNotifications } from './disableWebPushNotifications';
import { backgroundInitiatedWebPushSetupWorkflow } from './initiateWebPushSetupWorkflow';
import {
    loadLocalWebPushUserSetting,
    incrementUniqueDaysSessionCount,
} from './localWebPushUserSettingActions';
import { default as loadWebPushOptions } from './services/loadWebPushOptions';
import { getUserPreferenceIdentifier } from './utils/getUserPreferenceIdentifier';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import * as trace from 'owa-trace';

// only bootstrap once per session
let hasBootstrapped = false;

export default async function bootstrapWebPushService(windowObj: Window) {
    if (hasBootstrapped) {
        return;
    }

    if (windowObj.navigator.serviceWorker == null || windowObj.PushManager == null) {
        return;
    }

    let webPushNotificationsOptions = await loadWebPushOptions();
    if (webPushNotificationsOptions == null) {
        trace.trace.warn('[WebPush] WebPushNotificationsOptions not loaded.');
        return;
    }

    let mbxGuid = getUserConfiguration().SessionSettings.MailboxGuid;
    let userPreferenceIdentifier = getUserPreferenceIdentifier(
        mbxGuid,
        webPushNotificationsOptions
    );

    // Sync the store from persisted settings
    loadLocalWebPushUserSetting(windowObj, userPreferenceIdentifier);
    incrementUniqueDaysSessionCount(windowObj);
    try {
        if (webPushNotificationsOptions.enabled) {
            backgroundInitiatedWebPushSetupWorkflow(
                windowObj,
                webPushNotificationsOptions,
                mbxGuid
            );
        } else {
            disableWebPushNotifications(windowObj);
        }
        hasBootstrapped = true;
    } catch (error) {
        trace.errorThatWillCauseAlert(
            '[WebPush] Failed to initialize web push notifications, error: ' + error
        );
    }
}
