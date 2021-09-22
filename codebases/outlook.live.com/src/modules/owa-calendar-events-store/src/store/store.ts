import type { CalendarEventsStore } from './schema/CalendarEventsStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const defaultStore: CalendarEventsStore = {
    calendarFolderEvents: new ObservableMap(),
    fullItemsMruMap: new ObservableMap(),
    calendarFolderWorkingHours: new ObservableMap(),
};

export const getStore = createStore('calendarEventsStore', defaultStore);
