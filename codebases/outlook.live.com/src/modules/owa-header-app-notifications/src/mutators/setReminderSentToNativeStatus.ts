import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
import { ReminderData } from '../store/schema/ReminderData';
export default mutatorAction(
    'SET_REMINDERS_SENTTONATIVESTATUS',
    (rem: ReminderData, status: boolean) => {
        if (status) {
            getStore().remindersHost.push({ reminder: rem, sentNotificationToHost: status });
        } else {
            getStore().remindersHost = getStore().remindersHost.filter(
                reminderHost => reminderHost.reminder.itemId != rem.itemId
            );
        }
    }
);
