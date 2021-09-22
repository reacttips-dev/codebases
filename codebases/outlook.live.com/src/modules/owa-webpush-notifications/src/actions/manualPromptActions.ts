import { action } from 'satcheljs';

export const showManualNotificationPermissionsPrompt = action(
    'showManualNotificationPermissionsPrompt'
);
export const completeManualNotificationPermissionsPrompt = action(
    'completeManualNotificationPermissionsPrompt',
    (permission: NotificationPermission) => ({ permission })
);
