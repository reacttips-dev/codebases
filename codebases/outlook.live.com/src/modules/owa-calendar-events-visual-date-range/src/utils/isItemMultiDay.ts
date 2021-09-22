import { differenceInMilliseconds, differenceInCalendarDays, isAllDayEvent } from 'owa-datetime';
import type { CalendarEvent } from 'owa-calendar-types';
import TimeConstants from 'owa-datetime-utils/lib/TimeConstants';
import { getVisualDaySpan } from './getVisualDaySpan';

/**
 * Here is some event-duration terminology:
 * **Marked all day event** - an Event is marked as all-day (via property - i.e. `item.IsAllDayEvent`)
 * **Equivalent all day event** - Event is not marked as all-day but is equivalent in start/end (i.e. 12am - 12am), this is checked by `isAllDayEvent`
 * **multiday** - Event has a start and end time on different days, this checked in `isItemMultiDay`
 *
 * (These are used below in event-duration utils to help explain them)
 */

/**
 * @param item The Calendar event
 * @returns True if the item is a **Marked all day event** or event lasts longer than 24 hours
 */
export function isEventLongerThanTwentyFourHours(item: CalendarEvent) {
    return (
        item.IsAllDayEvent ||
        differenceInMilliseconds(item.End, item.Start) >= TimeConstants.MillisecondsInOneDay
    );
}

/**
 * @param item The Calendar event
 * @returns True if the item should span multiple days visually
 */
export function isItemMultiDayVisually(item: CalendarEvent) {
    if (isAllDayEvent(item.Start, item.End)) {
        return isItemMultiDay(item);
    } else {
        return getVisualDaySpan(item) >= 1;
    }
}

/**
 * @param item The Calendar event
 * @returns True if the item is **multiday**
 */
export function isItemMultiDay(item: CalendarEvent) {
    return Math.abs(differenceInCalendarDays(item.Start, item.End)) > 1;
}
