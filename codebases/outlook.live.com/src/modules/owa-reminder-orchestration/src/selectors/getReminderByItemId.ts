import type ItemId from 'owa-service/lib/contract/ItemId';
import getStore from '../store/store';
import type ParsedReminder from '../store/schema/ParsedReminder';

export default function getReminderByItemId(itemId: ItemId): ParsedReminder | null {
    const allReminders = [...getStore().reminders.values()];

    let reqReminder: ParsedReminder | null = null;
    for (let i = 0; i < allReminders.length; i++) {
        reqReminder = allReminders[i].filter(reminder => reminder.ItemId.Id === itemId.Id)[0];

        if (reqReminder) {
            return reqReminder;
        }
    }

    return null;
}
