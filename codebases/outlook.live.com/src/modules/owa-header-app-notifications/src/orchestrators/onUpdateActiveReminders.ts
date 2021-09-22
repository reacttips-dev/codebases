import { orchestrator } from 'satcheljs';
import { onUpdateActiveRemindersAction, sendReminderWebPush } from 'owa-reminder-orchestration';
import getStore from '../store/store';
import setReminders from '../mutators/setReminders';
import toggleReminderVisibility from '../mutators/toggleReminderVisibility';
import isReminderToastEnabled from '../selectors/isReminderToastEnabled';
import isReminderSoundEnabled from '../selectors/isReminderSoundEnabled';
import { playSound } from 'owa-audio';
import { getPackageBaseUrl } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isReminderWebPushLocallyEnabled } from 'owa-webpush-notifications';

export const REMINDER_SOUND_URI = 'resources/sounds/notifications/reminder.mp3';

export default orchestrator(onUpdateActiveRemindersAction, message => {
    const oldReminderIds = getStore().reminders.map(reminder => reminder.itemId.Id);
    const newReminderIds = message.activeReminders.map(reminder => reminder.ItemId.Id);

    setReminders(message.activeReminders);

    if (areNewReminders(oldReminderIds, newReminderIds)) {
        // #24251: Play notification sound
        if (isReminderToastEnabled()) {
            toggleReminderVisibility(true);
        }

        if (isReminderSoundEnabled()) {
            playSound(`${getPackageBaseUrl()}${REMINDER_SOUND_URI}`);
        }

        // Call the OWS Controller for sending web push notification for calendar reminders
        if (isFeatureEnabled('auth-sendReminderWebPush') && isReminderWebPushLocallyEnabled()) {
            sendReminderWebPush(message.activeReminders);
        }
    }
});

function areNewReminders(oldIds: string[], newIds: string[]) {
    for (let i = 0; i < newIds.length; i++) {
        if (oldIds.indexOf(newIds[i]) === -1) {
            return true;
        }
    }

    return false;
}

export type { ParsedReminder } from 'owa-reminder-orchestration';
