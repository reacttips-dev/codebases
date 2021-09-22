import getStore from '../store/store';
import type ParsedReminder from '../store/schema/ParsedReminder';

export default function getRemindersForAccount(
    userIdentity: string | null
): ParsedReminder[] | undefined {
    return getStore().reminders.get(userIdentity);
}
