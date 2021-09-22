import { orchestrator } from 'satcheljs';
import getRemindersForWebPush from '../actions/getRemindersForWebPush';
import getRemindersService from '../services/getReminders';
import { userDate } from 'owa-datetime';
import scheduleTimerForWebPushReminder from '../services/scheduleTimerForWebPushReminder';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { initializeLocalWebPushUserSetting } from '../utils/initializeLocalWebPushUserSetting';
import { isReminderWebPushLocallyEnabled } from 'owa-webpush-notifications';

// We make two GetReminders call during boot. One gets the reminders for next couple of hours and the other
// gets the reminders for next 24 hours (used to schedule timers for getting web push reminders). Since there is an
// overlap of ~2 hours in both the service calls, this was resulting in a race condition (DuplicateSecondaryKeyException
// and ConflictException) when trying to write to the store. So changed the 24 hour service call to query from now + 105 mins
// instead of the current time. So we need to keep the start time / end time for both the service calls in sync. Please
// make sure to change the START_TIME here if the MAX_MINUTES_FUTURE in ReminderWindowConstants is changed.
// Ideally Start_Time should always be (MAX_MINUTES_FUTURE - 15). Keeping an overlap of 15 mins in both the calls
// so that none of the reminders slip through the crack.
export const START_TIME = 105;
export const END_TIME = 1440;

export default orchestrator(getRemindersForWebPush, async () => {
    await initializeLocalWebPushUserSetting();
    if (
        isFeatureEnabled('auth-scheduleTimerForReminderWebPush') &&
        isReminderWebPushLocallyEnabled()
    ) {
        try {
            const remindersResponse = await getRemindersService(
                null /*userIdentity*/,
                START_TIME,
                END_TIME
            );

            const newReminders = remindersResponse?.Reminders || [];

            const newParsedReminders = newReminders.map(reminder => ({
                ...reminder,
                parsedStartDate: userDate(reminder.StartDate),
                parsedEndDate: userDate(reminder.EndDate),
                parsedReminderTime: userDate(reminder.ReminderTime),
                userIdentity: null,
            }));

            scheduleTimerForWebPushReminder(newParsedReminders);
        } catch (err) {
            logUsage('getRemindersForWebPush', { Error: err.toString() });
        }
    }
});
