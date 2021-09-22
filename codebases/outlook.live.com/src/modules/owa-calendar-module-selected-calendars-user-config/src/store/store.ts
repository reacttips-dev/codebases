import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

interface SelectedCalendarsStore {
    selectedCalendars: ObservableMap<string, string[]>;
}
const selectedCalendarsStoreData: SelectedCalendarsStore = {
    selectedCalendars: new ObservableMap<string, string[]>(),
};

export const selectedCalendarsStore = createStore<SelectedCalendarsStore>(
    'selectedCalendarsStore',
    selectedCalendarsStoreData
);
