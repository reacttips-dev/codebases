import type { LoadState } from './schema/LoadState';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

export const getStore = createStore('OwaCalendarsApiStore', {
    calendarIdsLoadState: new ObservableMap<string, LoadState>(),
});
