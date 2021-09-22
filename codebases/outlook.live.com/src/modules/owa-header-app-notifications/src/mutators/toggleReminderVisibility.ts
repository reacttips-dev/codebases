import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export default mutatorAction('TOGGLE_REMINDER_VISIBILITY', (isShown?: boolean) => {
    if (isShown === void 0) {
        getStore().showReminders = !getStore().showReminders;
    } else {
        getStore().showReminders = isShown;
    }
});
