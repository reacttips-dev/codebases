import type { CalendarEvent } from 'owa-calendar-types';
import hasAttendees from './hasAttendees';

/**
 * Returns true if the event is a meeting
 * @param event calendar item object
 */
export default function isEventAMeeting(event: CalendarEvent): boolean {
    if (!event) {
        return false;
    }
    if (event.IsDraft) {
        // no need to send cancellation in this case so only check attendee list
        return hasAttendees(event);
    } else {
        return event.IsMeeting || hasAttendees(event);
    }
}
