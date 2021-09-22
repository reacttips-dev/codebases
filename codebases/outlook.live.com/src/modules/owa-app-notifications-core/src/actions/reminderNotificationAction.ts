import type ReminderNotificationPayload from 'owa-service/lib/contract/ReminderNotificationPayload';
import { action } from 'satcheljs';

export default action(
    'REMINDER_NOTIFICATION',
    (notification: ReminderNotificationPayload, targetAccount: string | null) => ({
        notification,
        targetAccount,
    })
);
