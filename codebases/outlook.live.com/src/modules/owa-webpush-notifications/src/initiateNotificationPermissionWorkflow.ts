import { orchestrator } from 'satcheljs';
import {
    getNotificationPermission,
    requestPermission,
    startPollingWebPushPermission,
    stopPollingWebPushPermission,
} from './notificationPermission';
import {
    showNotificationPermissionsOverlay,
    dismissNotificationPermissionsOverlay,
} from './actions/overlayActions';
import {
    showManualNotificationPermissionsPrompt,
    completeManualNotificationPermissionsPrompt,
} from './actions/manualPromptActions';

export async function initiateNotificationPermissionWorkflow(
    windowObj: Window
): Promise<NotificationPermission> {
    let currentPermission = getNotificationPermission(windowObj);
    let permission = currentPermission;
    if (currentPermission == 'default') {
        showNotificationPermissionsOverlay();
        permission = await requestPermission(windowObj);
        dismissNotificationPermissionsOverlay();
    } else if (currentPermission == 'denied') {
        showManualNotificationPermissionsPrompt();
        startPollingWebPushPermission(windowObj);
        permission = await new Promise<NotificationPermission>((res, rej) => {
            orchestrator(completeManualNotificationPermissionsPrompt, ({ permission }) => {
                stopPollingWebPushPermission(windowObj);
                res(permission);
            });
        });

        if (permission === 'default') {
            // Firefox does not allow the user to manually change the permission to 'granted'.
            // The user can only reset the setting to the default.
            // So if the permission was 'denied' and now it's default, prompt one  more time to try to get it enabled.
            permission = await requestPermission(windowObj);
        }
    }

    return permission;
}
