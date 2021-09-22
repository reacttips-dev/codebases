import type CalendarEvent from '../types/CalendarEvent';
import { owaDate } from 'owa-datetime';

/**
 * Update the Start and End dates in the given CalendarEvent to have
 * the respective StartTimeZoneId and EndTimeZoneId.
 *
 * When a CalendarEvent is created from a CalendarItem we leave its
 * Start and End dates with the same time zone as returned by the server,
 * which is the user's time zone, since most of the calendar UI shows that.
 *
 * When we open the full compose form and we are showing the time zone controls, then
 * this function updates the dates on a clone of the cached event and the entire
 * form uses this updated Start & End times when displaying dates.
 */
export default function updateStartEndWithTimeZone(event: CalendarEvent) {
    event.Start = owaDate(event.StartTimeZoneId, event.Start);
    event.End = owaDate(event.EndTimeZoneId, event.End);
}
