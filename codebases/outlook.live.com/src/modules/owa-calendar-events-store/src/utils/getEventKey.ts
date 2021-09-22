import { CalendarEvent, getEventItemId } from 'owa-calendar-types';

/**
 * If forSeriesMaster is false, get the key used to cache the event OR
 * If forSeriesMaster is true, get the event key used to cache the series master of the event instance
 *
 * @param event event
 * @param forSeriesMaster boolean
 */
export default function getEventKey(
    event: CalendarEvent | Partial<CalendarEvent>,
    forSeriesMaster: boolean = false
): string | undefined {
    return forSeriesMaster ? getSeriesMasterEventKeyFromInstance(event) : getEventItemId(event);
}

/**
 * Get the event key used to cache the series master of the event instance
 * @param instanceEvent instance of a series
 */
export function getSeriesMasterEventKeyFromInstance(
    instanceEvent: CalendarEvent | Partial<CalendarEvent>
): string | undefined {
    return instanceEvent.SeriesMasterItemId?.Id;
}
