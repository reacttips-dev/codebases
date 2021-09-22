import type {
    TimePanelSelectedCalendarIdsStore,
    ConfigLoadState,
} from './schema/TimePanelSelectedCalendarIdsStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

export const getStore = createStore<TimePanelSelectedCalendarIdsStore>(
    'timePanelSelectedCalendarIdsStore',
    {
        configLoadStates: new ObservableMap<string, ConfigLoadState>(),
        calendarIdsMap: new ObservableMap<string, string[]>(),
    }
);
