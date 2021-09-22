import type CalendarCloudSettingsOptions from '../store/schema/CalendarCloudSettingsOptions';
import { action } from 'satcheljs';

/**
 * Initializes the calendar cloud settings from OCS
 */
export const initCalendarCloudSettings = action('initCalendarCloudSettings');

/**
 * Saves the calendar cloud settings
 * @param calendarCloudSettingsOptions - updates
 */
export const saveCalendarCloudSettings = action(
    'saveCalendarCloudSettings',
    (calendarCloudSettingsOptions: CalendarCloudSettingsOptions) => ({
        calendarCloudSettingsOptions,
    })
);

/**
 * Initializes the calendar cloud settings from boot settings
 */
export const initBootCalendarCloudSettings = action('initBootCalendarCloudSettings');
