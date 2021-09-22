import { action } from 'satcheljs';

/**
 * Patch the list of selected calendarIds for an account
 */
export const updateSelectedCalendarIds = action(
    'UPDATE_SELECTED_TIME_PANEL_CALENDARIDS',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

/**
 * Listen for patch operations on the list of selected calendarIds for an account
 */
export const onSelectedCalendarIdsUpdated = action('ON_SELECTED_TIME_PANEL_CALENDARIDS_UPDATED');
