import refreshReminders from './actions/refreshReminders';
import getRemindersForWebPush from './actions/getRemindersForWebPush';

// Import orchestrators
import './orchestrators/onReminderNotification';
import './orchestrators/onUpdateReminderData';
import './orchestrators/onDismissReminder';
import './orchestrators/onSnoozeReminder';
import './orchestrators/onAccountInitialized';
import './orchestrators/onGetRemindersForWebPush';

// Export actions
export { default as onUpdateActiveRemindersAction } from './actions/onUpdateActiveReminders';
export { default as dismissReminder } from './actions/dismissReminder';
export { default as snoozeReminder } from './actions/snoozeReminder';

// Bootstrap initial reminder load
refreshReminders(null);
getRemindersForWebPush();
export type { default as ParsedReminder } from './store/schema/ParsedReminder';

// Export services
export { default as sendReminderWebPush } from './services/sendReminderWebPush';
