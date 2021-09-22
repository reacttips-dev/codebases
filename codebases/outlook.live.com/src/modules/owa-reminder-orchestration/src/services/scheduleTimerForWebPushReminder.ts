import { makePutRequest } from 'owa-ows-gateway';
import * as trace from 'owa-trace';
import type ParsedReminder from '../store/schema/ParsedReminder';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { getUserConfiguration } from 'owa-session-store';
import { timestamp, getTimestamp } from 'owa-datetime';
import TimeConstants from 'owa-datetime-utils/lib/TimeConstants';
import sha256 from 'hash.js/lib/hash/sha/256';
import { getOrigin } from 'owa-url';
import { isFeatureEnabled } from 'owa-feature-flags';

const PUT_START_TIMER_URL: string = 'ows/v1.0/Timers/timer';
const PUT_START_TIMER_BATCH_URL: string = 'ows/v1.0/Timers/timerbatch';
const REMINDER_PROCESSOR_API_URL = '/ows/api/ReminderProcessor/processItem';
const BASE_URL = getOrigin();

export default function scheduleTimerForWebPushReminder(reminders: ParsedReminder[]) {
    // Filter the Calendar Reminders yet to happen and those within coming 24 hours (86400000 milliseconds)
    const calendarReminders = reminders.filter(
        reminder =>
            reminder.ReminderGroupTypes === ReminderGroupTypes.Calendar &&
            getTimestamp(reminder.parsedReminderTime) > timestamp() &&
            getTimestamp(reminder.parsedReminderTime) <=
                timestamp() + TimeConstants.MillisecondsInOneDay
    );

    let userConfiguration = getUserConfiguration();
    const timeZone = userConfiguration.UserOptions!.TimeZone;
    const userPrincipalName = userConfiguration.SessionSettings!.UserPrincipalName;
    const puid = userConfiguration.SessionSettings!.UserPuid;
    const tenantId = userConfiguration.SessionSettings!.ExternalDirectoryTenantGuid;
    if (!isFeatureEnabled('auth-notificationBatchApis')) {
        setTimeout(() => {
            calendarReminders.forEach(async calendarReminder => {
                try {
                    // Start a new timer
                    await makePutRequest(PUT_START_TIMER_URL, {
                        timerName: sha256().update(calendarReminder.ItemId.Id).digest('hex'),
                        payload: JSON.stringify({
                            id: calendarReminder.ItemId.Id,
                            timeZoneId: timeZone,
                            userPrincipalName: userPrincipalName,
                            puid: puid,
                            tenantId: tenantId,
                        }),
                        callbackURL: BASE_URL + REMINDER_PROCESSOR_API_URL,
                        scheduledTime: calendarReminder.parsedReminderTime,
                    });
                } catch (e) {
                    trace.errorThatWillCauseAlert(
                        `scheduleTimerForWebPushReminderFailure, error: ${e}`
                    );
                }
            });
        }, 30000);
    } else {
        setTimeout(() => {
            let batch = new Array();
            calendarReminders.forEach(calendarReminder => {
                batch.push({
                    timerName: sha256().update(calendarReminder.ItemId.Id).digest('hex'),
                    payload: JSON.stringify({
                        id: calendarReminder.ItemId.Id,
                        timeZoneId: timeZone,
                        userPrincipalName: userPrincipalName,
                        puid: puid,
                        tenantId: tenantId,
                    }),
                    callbackURL: BASE_URL + REMINDER_PROCESSOR_API_URL,
                    scheduledTime: calendarReminder.parsedReminderTime,
                });
            });

            try {
                // Start new timer batch
                if (batch.length > 0) {
                    makePutRequest(PUT_START_TIMER_BATCH_URL, { Batch: batch });
                }
            } catch (e) {
                trace.errorThatWillCauseAlert(
                    `scheduleTimerForWebPushReminderFailure, error in batch api: ${e}`
                );
            }
        }, 10000);
    }
}
