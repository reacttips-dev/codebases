import { mutatorAction } from 'satcheljs';
import type ParsedReminder from '../store/schema/ParsedReminder';
import getRemindersForAccount from '../selectors/getRemindersForAccount';

export default mutatorAction('DELETE_REMINDER', (reminder: ParsedReminder) => {
    const remindersForAccount = getRemindersForAccount(reminder.userIdentity);
    if (!remindersForAccount) {
        return;
    }

    const index = remindersForAccount.indexOf(reminder);

    if (index >= 0) {
        remindersForAccount.splice(index, 1);
    }
});
