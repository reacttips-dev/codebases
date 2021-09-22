import type { SettingItemResponseType } from '../SettingItemResponseType';

export interface TimePanelCalendarIdsRequestType {
    CalendarIds: string[];
}

export interface TimePanelCalendarIdsResponseType extends SettingItemResponseType {
    calendarIds: string[];
}

export function isTimePanelCalendarIdsResponseType(
    response: SettingItemResponseType
): response is TimePanelCalendarIdsResponseType {
    return (
        !!(<TimePanelCalendarIdsResponseType>response).calendarIds &&
        response.settingName === 'TimePanelCalendarIds'
    );
}
