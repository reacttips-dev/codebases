import { CalloutResult } from './actions/calloutActions';
import { default as disableWebPushNotifications } from './disableWebPushNotifications';
import { default as enableWebPushNotifications } from './enableWebPushNotifications';
import { getUserPreferenceIdentifier } from './utils/getUserPreferenceIdentifier';
import { initiateNotificationPermissionWorkflow } from './initiateNotificationPermissionWorkflow';
import { getLocalWebPushUserSettingStore } from './store/store';
import { promptUserToEnableWebPushWorkflow } from './promptUserToEnableWebPushWorkflow';
import { sendWebPushSetupAcknowledgeNotification } from './sendWebPushSetupAcknowledgeNotification';
import { showWebPushSecondChanceCallout } from './actions/secondChanceCalloutActions';
import { showWebPushSuccessCallout } from './actions/successCalloutActions';
import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';
import {
    incrementLocalWebPushPromptCount,
    resetLocalWebPushPromptCount,
    updateLocalWebPushEnabledStatus,
} from './localWebPushUserSettingActions';
import {
    shouldPromptUserToEnableWebPush,
    isAnyWebPushTypeLocallyEnabled,
} from './localWebPushUserSettingSelectors';
import {
    logEnableStart,
    logDisableStart,
    logWorkFlowEnd,
    logRoamingPromptResult,
    logPermission,
} from './optics/webpushOptics';

export async function userInitiatedWebPushSetupWorkflow(
    windowObj: Window,
    webPushNotificationsOptions: WebPushNotificationsOptions,
    mbxGuid: string,
    hasSecondChance: boolean = false,
    shouldSendAcknowledgeNotification: boolean = true
): Promise<boolean> {
    let userPreferenceIdentifier = getUserPreferenceIdentifier(
        mbxGuid,
        webPushNotificationsOptions
    );
    let enabled = await initiateNotificationPermissionAndWebPushSubscriptionWorkflow(
        windowObj,
        webPushNotificationsOptions,
        userPreferenceIdentifier,
        hasSecondChance
    );

    if (enabled) {
        if (shouldSendAcknowledgeNotification) {
            await sendWebPushSetupAcknowledgeNotification(windowObj);
        }
        showWebPushSuccessCallout();
    }

    return enabled;
}

export async function backgroundInitiatedWebPushSetupWorkflow(
    windowObj: Window,
    webPushNotificationsOptions: WebPushNotificationsOptions,
    mbxGuid: string
) {
    let userPreferenceIdentifier = getUserPreferenceIdentifier(
        mbxGuid,
        webPushNotificationsOptions
    );

    // While loading the local web push user settings from the browser local storage, the checkbox
    // options are being validated and updated accordingly. Which depends on the current options
    // selected and the state of reminder feature flag. So, we must check if either of the checkbox
    // options are enabled to procees further with the setup. Else, disableWebPushNotifications is called.
    let enabled = getLocalWebPushUserSettingStore().enabled && isAnyWebPushTypeLocallyEnabled();
    if (enabled) {
        await initiateNotificationPermissionAndWebPushSubscriptionWorkflow(
            windowObj,
            webPushNotificationsOptions,
            userPreferenceIdentifier,
            false
        );
    } else {
        let shouldPrompt = shouldPromptUserToEnableWebPush();
        if (shouldPrompt) {
            incrementLocalWebPushPromptCount(windowObj);
            let calloutResult = await promptUserToEnableWebPushWorkflow();
            logRoamingPromptResult(calloutResult);
            if (calloutResult === CalloutResult.Enabled) {
                // Switch from background initiated to user initiated workflow
                logEnableStart('roaming');
                let enabled = await userInitiatedWebPushSetupWorkflow(
                    windowObj,
                    webPushNotificationsOptions,
                    mbxGuid,
                    true
                );
                logWorkFlowEnd(enabled);
            } else if (calloutResult === CalloutResult.Disabled) {
                // Don't prompt user again on this machine
                logDisableStart('roaming', false);
                updateLocalWebPushEnabledStatus(windowObj, false, userPreferenceIdentifier);
            }
            // If the callout result was "Dismissed", don't take any permanent action.

            enabled = calloutResult === CalloutResult.Enabled;
        }
    }

    if (!enabled) {
        updateLocalWebPushEnabledStatus(windowObj, false, userPreferenceIdentifier);
        let result = await disableWebPushNotifications(windowObj);
        logWorkFlowEnd(result);
    }
}

async function initiateNotificationPermissionAndWebPushSubscriptionWorkflow(
    windowObj: Window,
    webPushNotificationsOptions: WebPushNotificationsOptions,
    userPreferenceIdentifier: string,
    hasSecondChance: boolean
): Promise<boolean> {
    let enabled = false;
    updateLocalWebPushEnabledStatus(windowObj, true, userPreferenceIdentifier);
    let permission = await initiateNotificationPermissionWorkflow(windowObj);
    if (permission == 'granted') {
        // Now the permission is granted, update the local status to enabled.
        enabled = await enableWebPushNotifications(webPushNotificationsOptions, windowObj);
    } else {
        if (permission == 'denied') {
            // The permission was denied on this machine, update the local status to disabled.
            updateLocalWebPushEnabledStatus(windowObj, false, userPreferenceIdentifier);
        }
        await disableWebPushNotifications(windowObj);
    }

    logPermission(permission);
    // Reset the local prompt count if user took action on granting permission.
    if (permission != 'default') {
        resetLocalWebPushPromptCount(windowObj);
    }

    // Notify the UI
    // We'll exit the setup workflow here, but the second chance callout may re-initiate it.
    // When it does, it will initiate the workflow with hasSecondChance === false, ensuring that you only get one second chance.
    if (!enabled && hasSecondChance) {
        showWebPushSecondChanceCallout();
    }

    return enabled;
}
