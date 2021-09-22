import type { CalendarEvent } from 'owa-calendar-types';
import { differenceInMilliseconds, now, subMinutes, isWithinRange } from 'owa-datetime';
import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';
import { hasReadRights } from 'owa-calendar-event-capabilities';

/**
 * Determines whether given event is within Now or one minute before Now
 *
 * @param upNextEvent - event marked as up-next
 * @param event - event to consider
 * @returns  a flag indicating whether the given event is within Now or one minute before Now
 */
export function isEventWithinNow(upNextEvent: CalendarEvent, event: CalendarEvent): boolean {
    // Ignore the event if its the same up-next event
    // or it is not an online meeting or if it doesn't have join url
    if (
        event.ItemId.Id === upNextEvent.ItemId.Id ||
        !event.IsOnlineMeeting ||
        event.OnlineMeetingJoinUrl === null
    ) {
        return false;
    }

    const isEventBeforeNow = isWithinRange(subMinutes(now(), 1), event.Start, event.End);
    const isEventNow = isWithinRange(now(), event.Start, event.End);
    const isLongMultiDayEvent =
        differenceInMilliseconds(event.End, event.Start) > MILLISECONDS_IN_DAY;

    return (
        (isEventBeforeNow || isEventNow) &&
        !isLongMultiDayEvent &&
        !event.IsAllDayEvent &&
        !event.IsCancelled &&
        !event.IsDraft &&
        event.ResponseType !== 'Decline' &&
        !isCalendarEventLocalLie(event) &&
        hasReadRights(event)
    );
}
