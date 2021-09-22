import type CalendarsCacheStore from './schema/CalendarsCacheStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const defaultCalendarsCacheStore: CalendarsCacheStore = {
    calendarEntryMapping: new ObservableMap(),
    folderIdToCalendarId: new ObservableMap(),
    validEntryMapping: new ObservableMap(),
    calendarGroupsMapping: new ObservableMap(),
    defaultCalendars: new ObservableMap(),
    calendarIdOrderedList: [],
    calendarGroupKeyOrderedList: [],
};

export default createStore<CalendarsCacheStore>('calendarsCacheStore', defaultCalendarsCacheStore);
