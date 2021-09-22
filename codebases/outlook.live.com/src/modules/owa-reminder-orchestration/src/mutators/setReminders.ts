import { mutatorAction } from 'satcheljs';
import type ParsedReminder from '../store/schema/ParsedReminder';
import getStore from '../store/store';

export default mutatorAction(
    'SET_REMINDERS',
    (userIdentity: string | null, reminders: ParsedReminder[]) => {
        getStore().reminders.set(userIdentity, reminders);
    }
);
