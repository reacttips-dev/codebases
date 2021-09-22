import type { CalendarEvent } from 'owa-calendar-types';

/**
 * Returns true if the event is a meeting and the current user is the organizer
 * @param item calendar item object
 */
export default function isMeetingOrganizer(item: CalendarEvent): boolean {
    return item?.IsMeeting && item?.IsOrganizer;
}
