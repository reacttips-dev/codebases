import { getTimePanelSelectedCalendarIdsMap } from './getSelectedCalendarIdsMap';
import { flattenObservableMapValues } from 'owa-selected-calendars-utils';

/**
 * Gets selected calendarIds as a flat list, preferably from Time Panel config
 * if non-empty or else fall back to Calendar module config
 */
export function getTimePanelSelectedCalendarIdsFlatList(): string[] {
    return flattenObservableMapValues(getTimePanelSelectedCalendarIdsMap());
}
