import { makePostRequest } from 'owa-ows-gateway';
import * as trace from 'owa-trace';
import type ParsedReminder from '../store/schema/ParsedReminder';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { getUserConfiguration } from 'owa-session-store';

const POST_REMINDER_PROCESSOR_WEB_PUSH_URL: string = 'ows/api/ReminderProcessor/processItem';

export default function sendReminderWebPush(reminders: ParsedReminder[]) {
    // Filter out the Calendar reminders
    const calendarReminders = reminders.filter(
        reminder => reminder.ReminderGroupTypes === ReminderGroupTypes.Calendar
    );
    // Extract the Item Ids
    const calendarReminderIds = calendarReminders.map(
        calendarreminder => calendarreminder.ItemId.Id
    );
    const timeZone = getUserConfiguration().UserOptions!.TimeZone;
    calendarReminderIds.forEach(async calendarreminderid => {
        try {
            // Call the OWS Controller
            await makePostRequest(POST_REMINDER_PROCESSOR_WEB_PUSH_URL, {
                id: calendarreminderid,
                timeZoneId: timeZone,
            });
        } catch (e) {
            trace.errorThatWillCauseAlert(`SendReminderWebPushFailure, error: ${e}`);
        }
    });
}
