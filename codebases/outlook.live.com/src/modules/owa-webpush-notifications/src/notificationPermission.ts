import { setWebPushPermission } from './actions/permissionActions';

let intervalHandle: number = -1;

export function getNotificationPermission(windowObj: Window): NotificationPermission {
    return windowObj.Notification?.permission;
}

export async function requestPermission(windowObj: Window): Promise<NotificationPermission> {
    return windowObj.Notification.requestPermission();
}

export function startPollingWebPushPermission(windowObj: Window) {
    let lastPermission = getNotificationPermission(windowObj);
    setWebPushPermission(lastPermission);
    intervalHandle = windowObj.setInterval(() => {
        let permission = getNotificationPermission(windowObj);
        if (permission !== lastPermission) {
            setWebPushPermission(permission);
            lastPermission = permission;
        }
    }, 1000);
}

export function stopPollingWebPushPermission(windowObj: Window) {
    if (intervalHandle !== -1) {
        windowObj.clearInterval(intervalHandle);
        intervalHandle = -1;
    }
}
