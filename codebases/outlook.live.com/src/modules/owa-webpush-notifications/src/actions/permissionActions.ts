import { action } from 'satcheljs';

export const setWebPushPermission = action(
    'setWebPushPermission',
    (permission: NotificationPermission) => ({ permission })
);
