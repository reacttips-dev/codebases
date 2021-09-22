import type SkypeNotificationType from '../store/schema/SkypeNotificationType';
import type { SkypeNotificationOptions } from 'owa-outlook-service-options';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateSkypeUserOption',
    function updateSkypeUserOption(
        userOptions: SkypeNotificationOptions,
        setting: 'skypeCallingNotification' | 'skypeMessageNotification',
        notificationType: SkypeNotificationType
    ) {
        userOptions[setting] = notificationType as number;
    }
);
