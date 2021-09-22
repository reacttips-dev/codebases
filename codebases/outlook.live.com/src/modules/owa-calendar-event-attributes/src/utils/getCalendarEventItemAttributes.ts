import type { CalendarEvent } from 'owa-calendar-types';
import { TimeConstants } from 'owa-datetime-utils';
import { isToday } from 'owa-observable-datetime';
import loc, { format } from 'owa-localize';
import {
    eventLocationAriaText,
    eventOrganizerAriaText,
    eventPrivateAriaText,
    eventRecurringAriaText,
    eventDescriptionAriaText,
    singleDayEventDescriptionAriaText,
    allDayEventDescriptionAriaText,
    whenStartEndsSameDayLongAriaText,
    whenStartEndsDifferentDayDateOnlyLongAriaText,
    whenStartEndsDifferentDayLongAriaText,
    eventTodaysDateAriaText,
    eventSelectedDateAriaText,
} from './getCalendarEventItemAttributes.locstring.json';
import {
    OwaDate,
    formatUserTime,
    formatWeekDayMonthDayYear,
    owaDate,
    isSameDay,
    differenceInMilliseconds,
} from 'owa-datetime';
import {
    getCalendarEventDateRangeVisualDateRange,
    isEventLongerThanTwentyFourHours,
} from 'owa-calendar-events-visual-date-range';
import {
    getCalendarEventItemSubjectText,
    getCalendarEventItemLocationText,
} from './getCalendarEventItemText';

export function getCalendarEventItemAriaLabel(
    item: CalendarEvent,
    timeZoneId?: string,
    isSelectedDay?: boolean
) {
    const stringBuilder = [];

    stringBuilder.push(whenAndTitle(item, timeZoneId, isSelectedDay));

    const location = getCalendarEventItemLocationText(item);
    if (location) {
        stringBuilder.push(format(loc(eventLocationAriaText), location));
    }

    if (item.Organizer && item.IsMeeting) {
        stringBuilder.push(format(loc(eventOrganizerAriaText), item.Organizer.Mailbox.Name));
    }

    if (item.CalendarItemType === 'Occurrence') {
        stringBuilder.push(loc(eventRecurringAriaText));
    }

    if (item.Sensitivity === 'Private') {
        stringBuilder.push(loc(eventPrivateAriaText));
    }

    return stringBuilder.join(' ');
}

export function getCalendarEventItemTitle(item: CalendarEvent, timeZoneId?: string) {
    const stringBuilder = [];

    const subject = getCalendarEventItemSubjectText(item);
    if (subject) {
        stringBuilder.push(subject);
    }

    const location = getCalendarEventItemLocationText(item);
    if (location) {
        stringBuilder.push(location);
    }

    const isMultidayEvent = isEventLongerThanTwentyFourHours(item);
    const when = getWhenStringForScreenReader(
        item.Start,
        item.End,
        timeZoneId,
        item.IsAllDayEvent,
        isMultidayEvent,
        false // don't include the date
    );
    stringBuilder.push(when);

    return stringBuilder.join('\n');
}

export function getCalendarEventItemTitleWithLocation(item: CalendarEvent, timeZoneId?: string) {
    const location = getCalendarEventItemLocationText(item);
    const titleForNameAndTime = getCalendarEventItemTitle(item);
    return location ? titleForNameAndTime + ' ' + location : titleForNameAndTime;
}

function whenAndTitle(item: CalendarEvent, timeZoneId: string, isSelectedDay: boolean): string {
    const subject = getCalendarEventItemSubjectText(item);
    // in jsMVVM, which we're porting here, "multi-day" event definition is when length > 24 hours or is marked as an all-day event
    const isMultidayEvent = isEventLongerThanTwentyFourHours(item);
    const when: string = getWhenStringForScreenReader(
        item.Start,
        item.End,
        timeZoneId,
        item.IsAllDayEvent,
        isMultidayEvent,
        true // include both date and time
    );

    const dateStatus = getDateStatus(item.Start, item.End, isSelectedDay);

    let stringFormat: string = loc(eventDescriptionAriaText);
    if (
        item.IsAllDayEvent &&
        isMultidayEvent &&
        differenceInMilliseconds(item.End, item.Start) == TimeConstants.MillisecondsInOneDay
    ) {
        stringFormat = loc(singleDayEventDescriptionAriaText);
    } else if (item.IsAllDayEvent && isMultidayEvent) {
        stringFormat = loc(allDayEventDescriptionAriaText);
    }

    return format(stringFormat, when, subject, dateStatus);
}

/**
 * This function builds a string from the item's info.
 * TODO: VSO 19024 currently this does not take locales into account, as owa-datetime implemention isn't finished. Will need to update
 * to use locales
 * @param start
 * @param end
 * @param isAllDayEvent
 * @param isMultiDayEvent
 * @param includeDate whether to include the date in the generated string. False includes only times
 */
function getWhenStringForScreenReader(
    start: OwaDate,
    end: OwaDate,
    timeZoneId: string,
    isAllDayEvent: boolean,
    isMultiDayEvent: boolean,
    includeDate: boolean
): string {
    if (timeZoneId) {
        start = owaDate(timeZoneId, start);
        end = owaDate(timeZoneId, end);
    }

    if (isSameDay(start, end)) {
        return format(
            loc(whenStartEndsSameDayLongAriaText),
            includeDate ? formatWeekDayMonthDayYear(start) : '',
            formatUserTime(start),
            formatUserTime(end)
        ).replace('  ', ' '); // strip out any unnecessary blank space
    }

    if (isAllDayEvent && isMultiDayEvent) {
        if (differenceInMilliseconds(end, start) == TimeConstants.MillisecondsInOneDay) {
            return formatWeekDayMonthDayYear(start);
        }
        const endDate: string = formatWeekDayMonthDayYear(
            getCalendarEventDateRangeVisualDateRange({ start: start, end: end }).end
        );
        return format(
            loc(whenStartEndsDifferentDayDateOnlyLongAriaText),
            formatWeekDayMonthDayYear(start),
            endDate
        );
    }

    return format(
        loc(whenStartEndsDifferentDayLongAriaText),
        formatWeekDayMonthDayYear(start),
        formatUserTime(start),
        formatWeekDayMonthDayYear(end),
        formatUserTime(end)
    );
}

function getDateStatus(start: OwaDate, end: OwaDate, isSelectedDay: boolean): string {
    if (isToday(start) || isToday(end)) {
        return eventTodaysDateAriaText;
    }
    return isSelectedDay ? eventSelectedDateAriaText : '';
}
