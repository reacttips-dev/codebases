import loc from 'owa-localize';
import {
    addDays,
    addHours,
    formatUserTime,
    formatWeekDayTime,
    getDate,
    getDay,
    getMonth,
    getYear,
    isAfter,
    isSameDay,
    OwaDate,
    owaDate,
    startOfDay,
    startOfHour,
} from 'owa-datetime';
import {
    scheduleLaterToday,
    scheduleThisEvening,
    scheduleTomorrow,
    scheduleThisWeekend,
    scheduleNextWeek,
} from './createScheduleSubMenu.locstring.json';
import { observableNow } from 'owa-observable-datetime';
import DayOfWeek from 'owa-service/lib/contract/DayOfWeek';
import type SubMenuDate from '../store/schema/SubMenuDate';

const hourOffsetRegular = 8;
const hourOffsetLater = 3;
const hourOffsetEvening = 18;
const hourOffsetWeekend = 10;

// Schedule 3 hours into future
export function laterDate(date: OwaDate) {
    return addHours(startOfHour(date), hourOffsetLater);
}

// Schedule for evening
function eveningDate(date: OwaDate) {
    return addHours(startOfDay(date), hourOffsetEvening);
}

// Schedule for tomorrow
function tomorrowDate(date: OwaDate) {
    return addHours(addDays(startOfDay(date), 1), hourOffsetRegular);
}

// Schedule for weekend (next saturday)
function weekendDate(date: OwaDate) {
    return getNextDay(date, DayOfWeek.Saturday, hourOffsetWeekend);
}

// Schedule for next week (next monday)
function firstWeekdayDate(date: OwaDate) {
    let nextWeekday = getNextDay(date, DayOfWeek.Monday, hourOffsetRegular);

    // This avoids the condition where we schedule on monday and wrap around to
    // the same monday (today), so we must add 7 to get next week's start.
    if (isAfter(date, nextWeekday)) {
        nextWeekday = addDays(nextWeekday, 7);
    }
    return nextWeekday;
}

// Calculate the next day that satisfies offset
export function getNextDay(date: OwaDate, dow: number, hour: number) {
    return owaDate(
        date.tz,
        getYear(date),
        getMonth(date),
        getDate(date) + ((dow + (7 - getDay(date))) % 7),
        hour
    );
}

// gets an array of times relative to now for snoozing
export default function getDateOptions(): SubMenuDate[] {
    const currentTime = observableNow();
    const laterToday = laterDate(currentTime);
    const tomorrow = tomorrowDate(currentTime);
    const evening = eveningDate(currentTime);
    const weekend = weekendDate(currentTime);
    const firstWeekday = firstWeekdayDate(currentTime);

    const scheduleSubMenuDates: SubMenuDate[] = [];

    scheduleSubMenuDates.push({
        date: laterToday,
        name: loc(scheduleLaterToday),
        secondaryText: formatUserTime(laterToday),
    });

    if (isAfter(evening, laterToday) && isSameDay(laterToday, currentTime)) {
        scheduleSubMenuDates.push({
            date: evening,
            name: loc(scheduleThisEvening),
            secondaryText: formatUserTime(evening),
        });
    }

    scheduleSubMenuDates.push({
        date: tomorrow,
        name: loc(scheduleTomorrow),
        secondaryText: formatWeekDayTime(tomorrow),
    });

    scheduleSubMenuDates.push({
        date: weekend,
        name: loc(scheduleThisWeekend),
        secondaryText: formatWeekDayTime(weekend),
    });

    scheduleSubMenuDates.push({
        date: firstWeekday,
        name: loc(scheduleNextWeek),
        secondaryText: formatWeekDayTime(firstWeekday),
    });

    return scheduleSubMenuDates;
}
