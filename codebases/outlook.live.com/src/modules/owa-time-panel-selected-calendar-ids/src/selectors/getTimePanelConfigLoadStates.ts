import { getStore } from '../store/store';
import type { ConfigLoadState } from '../store/schema/TimePanelSelectedCalendarIdsStore';
import type { ObservableMap } from 'mobx';

/**
 * Gets Time Panel config load states as a map of accounts to load states
 */
export function getTimePanelConfigLoadStates(): ObservableMap<string, ConfigLoadState> {
    return getStore().configLoadStates;
}
