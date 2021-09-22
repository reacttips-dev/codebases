import { getStore } from '../store/store';
import type { ObservableMap } from 'mobx';
import { dedupeObservableMapValues } from 'owa-selected-calendars-utils';

/**
 * Gets selected calendars config from Time Panel store
 *
 * This selector is only meant for internal use where we explicitly want to read from Time Panel config,
 * regardless of which config is currently being referenced to power user experiences
 */
export function getSelectedCalendarsFromTimePanel(): ObservableMap<string, string[]> {
    return dedupeObservableMapValues(getStore().calendarIdsMap);
}
