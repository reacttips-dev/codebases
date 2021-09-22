import { isUpNextOption } from './selectUpNextEvent';
import { CalendarEvent, overlap } from 'owa-calendar-types';
import { isAfter } from 'owa-datetime';
import { observableNow } from 'owa-observable-datetime';

/**
 * Determines whether given event is conflicting with up-next event
 *
 * @param upNextEvent - event marked as up-next
 * @param event - event to consider
 * @returns  a flag indicating whether the given event conflicts with the up-next event
 */
export function isConflictingWithUpNextEvent(
    upNextEvent: CalendarEvent,
    event: CalendarEvent
): boolean {
    const now = observableNow();

    // Ignore the event if its the same up-next event
    if (event.ItemId.Id === upNextEvent.ItemId.Id) {
        return false;
    }

    // If the event overlaps with the up-next event and
    // it starts at the same time or before the up-next event and
    // it is a valid event (see details in UpNextOption)
    // then it qualifies as as a conflicting event for up-next event
    return (
        overlap(event, upNextEvent) &&
        !isAfter(event.Start, upNextEvent.Start) &&
        isUpNextOption(now)(event)
    );
}
