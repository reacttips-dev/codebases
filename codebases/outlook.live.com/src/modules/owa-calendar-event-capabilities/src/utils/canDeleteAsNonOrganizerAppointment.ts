import type { CalendarEvent } from 'owa-calendar-types';
import isEventAMeeting from './isEventAMeeting';
import canModify from './canModify';

/**
 * Determines if the delete button is to be shown for an event
 * where the event is not a meeting and the user is not the organizer
 * but the user is able to modify the item
 *
 * This can occur when an ics file or a meeting request from another client
 * lists an organizer but does not provide a list of attendees or mark the event
 * as a meeting
 */
export default (item: CalendarEvent): boolean =>
    !isEventAMeeting(item) && !item.IsOrganizer && canModify(item) && !item.IsCancelled;
