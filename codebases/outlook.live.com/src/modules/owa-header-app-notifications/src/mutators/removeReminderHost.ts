import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
export default mutatorAction('REMOVE_REMINDERS_SENTTONATIVE', (reminderItemId: string) => {
    getStore().remindersHost = getStore().remindersHost.filter(
        reminderHost => reminderHost.reminder.itemId.Id != reminderItemId
    );
});
