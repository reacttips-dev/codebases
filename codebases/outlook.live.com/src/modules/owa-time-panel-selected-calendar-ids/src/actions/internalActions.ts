import { action } from 'satcheljs';
import type { ConfigLoadState } from '../store/schema/TimePanelSelectedCalendarIdsStore';

export const updateSelectedCalendarIdsInStore = action(
    'UPDATE_SELECTED_TIME_PANEL_CALENDARIDS_IN_STORE',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

export const setTimePanelConfigLoadState = action(
    'SET_TIME_PANEL_CONFIG_LOAD_STATE',
    (loadState: ConfigLoadState, userIdentity: string) => ({ loadState, userIdentity })
);
