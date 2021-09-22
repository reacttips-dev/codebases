import type CalendarCloudSetting from '../store/schema/CalendarCloudSetting';
import { action } from 'satcheljs';

/**
 * Called to set a calendar cloud setting in store
 */
export const setCalendarCloudSetting = action(
    'setCalendarCloudSetting',
    (calendarCloudSetting: CalendarCloudSetting) => ({
        calendarCloudSetting,
    })
);

/**
 * Called to populate the cloud settings in store
 */
export const updateCalendarCloudSettings = action(
    'updateCalendarCloudSettings',
    (calendarCloudSettings: CalendarCloudSetting[]) => ({
        calendarCloudSettings,
    })
);
