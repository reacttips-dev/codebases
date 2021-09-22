import { default as disableWebPushNotifications } from './disableWebPushNotifications';
import { getUserPreferenceIdentifier } from './utils/getUserPreferenceIdentifier';
import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';
import {
    updateLocalWebPushEnabledStatus,
    resetLocalWebpushUserSetting,
} from './localWebPushUserSettingActions';

export async function userInitiatedWebPushDisableWorkflow(
    windowObj: Window,
    webPushNotificationsOptions: WebPushNotificationsOptions,
    mbxGuid: string,
    disableAllClients: boolean
): Promise<boolean> {
    let userPreferenceIdentifier = getUserPreferenceIdentifier(
        mbxGuid,
        webPushNotificationsOptions
    );

    if (disableAllClients) {
        resetLocalWebpushUserSetting(windowObj, userPreferenceIdentifier);
    } else {
        updateLocalWebPushEnabledStatus(windowObj, false, userPreferenceIdentifier);
    }

    return disableWebPushNotifications(windowObj);
}
