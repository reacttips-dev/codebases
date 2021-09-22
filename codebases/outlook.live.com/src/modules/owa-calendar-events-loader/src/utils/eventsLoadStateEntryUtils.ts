import type { EventsLoadState } from '../store/schema/LoadState';

export type EventsLoadStateEntry = [string, EventsLoadState];
export type EventsLoadStateEntryFilter = (eventsLoadStateEntry: EventsLoadStateEntry) => boolean;

export function aggCalendarIds(
    eventsLoadStateEntryFilter: EventsLoadStateEntryFilter = () => true
) {
    return (agg: string[], [key, eventsLoadState]: EventsLoadStateEntry): string[] => {
        if (eventsLoadStateEntryFilter([key, eventsLoadState])) {
            agg.push(key);
        }
        return agg;
    };
}

export function hasLoadState(loadState: EventsLoadState) {
    return ([key, eventsLoadState]: EventsLoadStateEntry): boolean => {
        return eventsLoadState === loadState;
    };
}
