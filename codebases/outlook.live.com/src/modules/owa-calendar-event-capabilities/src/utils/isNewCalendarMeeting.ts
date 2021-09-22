import type { CalendarEvent } from 'owa-calendar-types';
import isEventAMeeting from './isEventAMeeting';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';

/**
 * Returns true if the event is a meeting and an event being created
 * @param item calendar item object
 */
export default function isNewCalendarMeeting(item: CalendarEvent): boolean {
    return isCalendarEventLocalLie(item) && isEventAMeeting(item);
}
