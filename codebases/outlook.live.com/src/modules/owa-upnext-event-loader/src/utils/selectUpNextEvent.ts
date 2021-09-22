import { hasReadRights } from 'owa-calendar-event-capabilities';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';
import { CalendarEvent, compareCalendarEvents, compareFreeBusyType } from 'owa-calendar-types';
import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import { differenceInMilliseconds, isBefore, now, OwaDate } from 'owa-datetime';

/**
 * Determine which event in a list should be considered "up-next"
 * based on a list of criteria (see `selectOptimalUpNext` for details)
 *
 * @param events - list of events to consider
 * @param areEventsSorted - optimization hint for when `events` list is already sorted (defaults to false)
 * @returns event that should be considered up-next, or `null` if list is empty
 */
export function selectUpNextEvent(
    events: CalendarEvent[],
    areEventsSorted: boolean = false
): CalendarEvent | null {
    const currentTime = now();
    const allEvents = [...events];
    if (!areEventsSorted) {
        allEvents.sort(compareCalendarEvents);
    }
    return selectOptimalUpNextEvent(allEvents, currentTime);
}

/**
 * Selects the optimal up-next event from the list of events based on the current time
 *
 * @param eventsList - list of events to consider
 * @param currentTime - clock time
 * @returns event that should be considered up-next, or `null` if list is empty
 */
function selectOptimalUpNextEvent(
    eventsList: CalendarEvent[],
    currentTime: OwaDate
): CalendarEvent | null {
    // 1) Handle base cases
    if (!eventsList || eventsList.length === 0) {
        return null;
    }

    // 2) Filter events to subset of eligible up-next options, based on relevance and timing heuristics
    //
    //    This will ensure that only meaningful events can be selected as up-next.
    //
    //    Additionally, options that appear before other events in the sorted list which have already
    //    ended are removed from consideration.
    //
    //    This will bias the up-next marker toward moving sequentially forward in the list and select
    //    an event closer to the current time rather than potentially sticking to / moving back to an
    //    earlier event with a long duration
    const isUpNextOptionNow = isUpNextOption(currentTime);
    const upNextOptions = eventsList.filter((event, eventIdx) => {
        // disqualify events that fail the relevance heuristic for current time
        if (!isUpNextOptionNow(event)) {
            return false;
        }

        // refine eligibility based on whether there are any later events that are relevant but already over
        const laterEvents = eventsList.slice(eventIdx + 1);
        return !laterEvents.some(laterEvent => isBefore(laterEvent.End, currentTime));
    });

    // 3) Attempt to select up-next event from the filtered list of options for simple scenarios
    if (upNextOptions.length === 0) {
        return null;
    }
    if (upNextOptions.length === 1) {
        return upNextOptions[0];
    }

    // 4) Tie-break on minimized time delta between current time and event start (past or future)
    //
    //    This will move the up-next marker forward at the halfway point between the most
    //    recently started event and the next upcoming event
    const upNextOptionsWithMinTimeDelta = upNextOptions.reduce(
        (closestEvents: CalendarEvent[], event: CalendarEvent) => {
            // handle base case
            if (closestEvents.length === 0) {
                return [event];
            }
            // compare event time delta against smallest time delta seen so far
            const smallestTimeDelta = computeAbsoluteTimeDelta(closestEvents[0].Start, currentTime);
            const eventTimeDelta = computeAbsoluteTimeDelta(event.Start, currentTime);
            if (eventTimeDelta < smallestTimeDelta) {
                return [event];
            } else if (eventTimeDelta === smallestTimeDelta) {
                closestEvents.push(event);
                return closestEvents;
            } else {
                return closestEvents;
            }
        },
        []
    );

    // 5) Tie-break on free/busy status ranking
    //
    //    This will prioritize placing the up-next marker on an event with the highest "blocked-out"
    //    status in the scenario where multiple events are equally close to the current time
    const upNextOptionsByBusyStatus = upNextOptionsWithMinTimeDelta.sort(compareFreeBusyType);
    return upNextOptionsByBusyStatus[0];
}

/**
 * Creates a filter predicate for eligible up-next events based on the current time
 *
 * @param currentTime - clock time
 * @returns filter predicate that returns true for an event that satisfies minimum criteria
 * for being an up-next option (although it may not be the current up-next event)
 */
export function isUpNextOption(currentTime: OwaDate): (event: CalendarEvent) => boolean {
    return (event: CalendarEvent): boolean => {
        // if true, this calendar item has already ended, so it cannot be an up-next event
        const eventIsInThePast = isBefore(event.End, currentTime);
        // if true, this calendar item spans more than 24 hours, so it cannot be an up-next event
        const isLongMultiDayEvent =
            differenceInMilliseconds(event.End, event.Start) > MILLISECONDS_IN_DAY;
        // if false, this calendar item has not been created on the server, so it cannot be an up-next event
        const eventExistsOnServer = !isCalendarEventLocalLie(event);
        // if false, this calendar item only exposes free/busy status (no full details), so it cannot be an up-next event
        const eventHasReadRights = hasReadRights(event);
        return (
            !eventIsInThePast &&
            !isLongMultiDayEvent &&
            !event.IsAllDayEvent &&
            !event.IsCancelled &&
            !event.IsDraft &&
            event.ResponseType !== 'Decline' &&
            eventExistsOnServer &&
            eventHasReadRights
        );
    };
}

/**
 * Calculates the absolute values of the time delta between two display dates
 *
 * @param left - first display date
 * @param right - second display date
 * @returns absolute value of the number of milliseconds between the two display dates
 */
function computeAbsoluteTimeDelta(left: OwaDate, right: OwaDate): number {
    return Math.abs(differenceInMilliseconds(left, right));
}
