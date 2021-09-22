import { reminderNotificationAction } from 'owa-app-notifications-core';
import { orchestrator } from 'satcheljs';
import refreshReminders from '../actions/refreshReminders';

export default orchestrator(reminderNotificationAction, ({ notification, targetAccount }) => {
    if (notification.shouldGetReminders) {
        refreshReminders(targetAccount);
    }
});

export type { default as ReminderNotificationPayload } from 'owa-service/lib/contract/ReminderNotificationPayload';
