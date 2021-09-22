import { action } from 'satcheljs';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { OwaDate } from 'owa-datetime';

export default action('SNOOZE_REMINDER', (itemId: ItemId, newReminderTime: OwaDate) => ({
    itemId,
    newReminderTime,
}));
