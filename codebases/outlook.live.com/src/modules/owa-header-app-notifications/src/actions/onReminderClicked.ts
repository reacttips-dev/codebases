import type ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { action } from 'satcheljs';

export default action(
    'ON_REMINDER_CLICKED',
    (itemId: string, reminderType: ReminderGroupTypes) => ({ itemId, reminderType })
);
