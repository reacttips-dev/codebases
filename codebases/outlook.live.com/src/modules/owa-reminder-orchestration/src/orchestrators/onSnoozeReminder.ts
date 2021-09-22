import snoozeReminderAction from '../actions/snoozeReminder';
import snoozeReminderService from '../services/snoozeReminder';
import { orchestrator } from 'satcheljs';
import setReminderTime from '../mutators/setReminderTime';
import pushActiveRemindersAndSetTimeout from './pushActiveRemindersAndSetTimeout';
import getReminderByItemId from '../selectors/getReminderByItemId';

export default orchestrator(snoozeReminderAction, async message => {
    let { itemId, newReminderTime } = message;

    const reminder = getReminderByItemId(itemId);

    if (reminder) {
        setReminderTime(reminder, newReminderTime);
        pushActiveRemindersAndSetTimeout(reminder.userIdentity);

        await snoozeReminderService(reminder.userIdentity, itemId, newReminderTime);
    }
});

export type { default as ItemId } from 'owa-service/lib/contract/ItemId';
export type { OwaDate } from 'owa-datetime';
