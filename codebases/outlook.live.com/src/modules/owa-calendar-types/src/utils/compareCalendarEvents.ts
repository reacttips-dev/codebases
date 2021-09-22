import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import type CalendarEvent from '../types/CalendarEvent';
import compareFreeBusyType from './compareFreeBusyType';
import renderAsAllDay from './renderAsAllDay';
import { differenceInMilliseconds } from 'owa-datetime';
import { isPrimaryCalendar, isOwnedCalendar } from './compareCalendarEventsCalendarUtils';

/**
 * Compares two calendar events
 * @param {CalendarEvent} item1 first event to compare
 * @param {CalendarEvent} item2 second event to compare
 * @returns positive number if item1 > item2, otherwise returns negative number
 */
export default function compareCalendarEvents(item1: CalendarEvent, item2: CalendarEvent): number {
    // First sort by all day events
    let render1AsAllDay = renderAsAllDay(item1);
    let render2AsAllDay = renderAsAllDay(item2);
    if (render1AsAllDay != render2AsAllDay) {
        return render1AsAllDay ? -1 : 1;
    }

    // Then sort by day span
    let diff = getItemDaySpan(item2) - getItemDaySpan(item1);
    if (diff != 0) {
        return diff;
    }

    // Then sort by start time.
    diff = differenceInMilliseconds(item1.Start, item2.Start);
    if (diff != 0) {
        return diff;
    }

    if (isCalendarTypeSortingSupported(item1) && isCalendarTypeSortingSupported(item2)) {
        // Then by whether calendar is primary
        let isPrimaryCalendar1 = isPrimaryCalendar(item1);
        let isPrimaryCalendar2 = isPrimaryCalendar(item2);
        if (isPrimaryCalendar1 != isPrimaryCalendar2) {
            return isPrimaryCalendar1 ? -1 : 1;
        }

        // Then by calendar ownership
        let isOwnedCalendar1 = isOwnedCalendar(item1);
        let isOwnedCalendar2 = isOwnedCalendar(item2);
        if (isOwnedCalendar1 != isOwnedCalendar2) {
            return isOwnedCalendar1 ? -1 : 1;
        }
    }

    // Then sort by "show as" value.
    diff = compareFreeBusyType(item1, item2);
    if (diff != 0) {
        return diff;
    }

    // Then sort by end time (longer duration is first).
    diff = differenceInMilliseconds(item2.End, item1.End);
    if (diff != 0) {
        return diff;
    }

    // At last, sort by subject.
    diff = compareStringProperty(item1.Subject, item2.Subject);
    if (diff != 0) {
        return diff;
    }

    // Then sort by whether item is recurring.
    diff = compareStringProperty(item1.CalendarItemType, item2.CalendarItemType);
    if (diff != 0) {
        return diff;
    }

    // Then sort by parent folder ID
    diff = compareStringProperty(item1.ParentFolderId.Id, item2.ParentFolderId.Id);
    if (diff != 0) {
        return diff;
    }

    // Finally sort by item ID
    return compareStringProperty(item1.ItemId.Id, item2.ItemId.Id);
}

function compareStringProperty(property1: string, property2: string): number {
    return (property1 || '').localeCompare(property2 || '');
}

/**
 * Returns number of days the item spans
 */
function getItemDaySpan(item: CalendarEvent): number {
    let duration = differenceInMilliseconds(item.End, item.Start);
    return Math.max(Math.ceil(duration / MILLISECONDS_IN_DAY), 1);
}

// TODO VSO 122427: Remove or handle the dependency of calendar code on calendar event __type property
/**
 * Checks if the calendar event supports sorting based on its calendar types (such as isPrimaryCalendar or isOwnedCalendar)
 * For example, AnonymousCalendar doesn't have userEmailAddress or defaultCalendar (in CalendarsCacheStore) that are expected
 * when checking isPrimaryCalendar or isOwnedCalendar
 */
function isCalendarTypeSortingSupported(item: CalendarEvent): boolean {
    return item.__type != 'Booking' && item.__type != 'AnonymousCalendarEvent';
}
