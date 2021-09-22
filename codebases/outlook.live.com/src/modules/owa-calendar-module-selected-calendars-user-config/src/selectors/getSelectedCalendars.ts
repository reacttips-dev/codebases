import { selectedCalendarsStore } from '../store/store';
import type { ObservableMap } from 'mobx';
import {
    dedupeObservableMapValues,
    flattenObservableMapValues,
} from 'owa-selected-calendars-utils';

export function getSelectedCalendars(): ObservableMap<string, string[]> {
    return dedupeObservableMapValues(selectedCalendarsStore().selectedCalendars);
}
export function getSelectedCalendarsFlatList(): string[] {
    return flattenObservableMapValues(getSelectedCalendars());
}
