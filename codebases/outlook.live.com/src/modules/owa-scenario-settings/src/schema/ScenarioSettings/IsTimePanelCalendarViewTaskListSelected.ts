import type { SettingItemResponseType } from '../SettingItemResponseType';

export interface IsTimePanelCalendarViewTaskListSelectedRequestType {
    isSelected: boolean;
}

export interface IsTimePanelCalendarViewTaskListSelectedResponseType
    extends SettingItemResponseType {
    isSelected: boolean;
}

export function isIsTimePanelCalendarViewTaskListSelectedResponseType(
    response: SettingItemResponseType
): response is IsTimePanelCalendarViewTaskListSelectedResponseType {
    return (
        (<IsTimePanelCalendarViewTaskListSelectedResponseType>response).isSelected !== undefined &&
        response.settingName === 'IsTimePanelCalendarViewTaskListSelected'
    );
}
