import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { EventsCacheLockId } from 'owa-calendar-events-store';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsLoadState, ScenarioLoadState } from './schema/LoadState';

export interface EventsLoadedData {
    eventsCacheLockId: EventsCacheLockId;
    loadedDateRange: DateRange | null;
    scenarioLoadState: ScenarioLoadState; // The combined load state of all calendar event requests for an eventsCacheLockId
    calendarEventsLoadState: ObservableMap<string, EventsLoadState>; // CalendarId => loadState, the load state of calendar event requests for each calendar.
    isInitializingCalendarEventsLoader: boolean; // used internally to determine if the calendar events loader is being initialized
}

interface EventsLoadedStore {
    scenarios: ObservableMap<EventsCacheLockId, EventsLoadedData>;
}
const EventsLoadedStoreData: EventsLoadedStore = {
    scenarios: new ObservableMap(),
};

export const getEventsLoadedStore = createStore<EventsLoadedStore>(
    'EventsLoadedStore',
    EventsLoadedStoreData
);
