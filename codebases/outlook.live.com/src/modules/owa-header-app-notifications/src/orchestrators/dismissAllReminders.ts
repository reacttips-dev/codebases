import getStore from '../store/store';
import { dismissReminder } from 'owa-reminder-orchestration';
import { orchestrator } from 'satcheljs';
import onDismissAllReminders from '../actions/onDismissAllReminders';
import { ANIMATION_DURATION } from '../utils/reminderAnimationConstants';
import sleep from 'owa-sleep';
import toggleReminderVisibility from '../mutators/toggleReminderVisibility';

export default orchestrator(onDismissAllReminders, async function dismissAll() {
    dismissReminder(getStore().reminders.map(reminder => reminder.itemId));

    // We want to wait until the animation completes before toggling the reminder visibility off
    // We need to do that separately so no DOM elements are left behind.
    await sleep(ANIMATION_DURATION);

    toggleReminderVisibility(false);
});
