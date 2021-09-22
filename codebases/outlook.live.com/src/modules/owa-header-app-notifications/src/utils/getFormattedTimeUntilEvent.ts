import { now as now_1 } from 'owa-locstrings/lib/strings/now.locstring.json';
import {
    reminder_today_time,
    reminder_tomorrow_time,
    time_ago,
} from './getFormattedTimeUntilEvent.locstring.json';
import loc, { format } from 'owa-localize';
import abbreviatedFormatDuration from 'owa-duration-formatter/lib/abbreviated';
import { differenceInSeconds, isAllDayEvent, OwaDate } from 'owa-datetime';

import type { ReminderData } from '../store/schema/ReminderData';
import isTaskReminder from './isTaskReminder';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default function getFormattedTimeUntilEvent(reminder: ReminderData, now: OwaDate) {
    const { startTime, endTime, reminderTime, reminderType } = reminder;
    const isTask = isTaskReminder(reminderType);

    const secondsUntil = isTask
        ? differenceInSeconds(reminderTime, now)
        : differenceInSeconds(startTime, now);
    const isAllDay = isTask ? false : isAllDayEvent(startTime, endTime);

    if (isAllDay && secondsUntil < 0) {
        return loc(reminder_today_time);
    } else if (isAllDay && secondsUntil < ONE_DAY_IN_SECONDS) {
        return loc(reminder_tomorrow_time);
    } else {
        if (secondsUntil < 60 && secondsUntil > -60) {
            return loc(now_1);
        }

        return secondsUntil > 0
            ? formatSeconds(secondsUntil)
            : format(loc(time_ago), formatSeconds(-secondsUntil));
    }
}

function formatSeconds(seconds: number) {
    return abbreviatedFormatDuration(seconds, {
        maxUnits: 1,
    });
}
