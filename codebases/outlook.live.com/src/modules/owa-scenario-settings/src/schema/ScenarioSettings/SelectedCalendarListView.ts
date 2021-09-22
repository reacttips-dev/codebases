import type { SettingItemResponseType } from '../SettingItemResponseType';

// The is a server defined type, and should be kept in sync.
// In the server-ows-api project: src/Microsoft.OWS.ScenarioSettings/Models/ScenarioSettings/SelectedCalendarListViewType.cs
export type SelectedCalendarListViewType = 'Agenda' | 'Day';

export interface SelectedCalendarListViewRequestType {
    ViewType: SelectedCalendarListViewType;
}

export interface SelectedCalendarListViewResponseType extends SettingItemResponseType {
    selectedView: SelectedCalendarListViewType;
}

export function isSelectedCalendarListViewResponseType(
    response: SettingItemResponseType
): response is SelectedCalendarListViewResponseType {
    return (
        !!(<SelectedCalendarListViewResponseType>response).selectedView &&
        response.settingName === 'SelectedCalendarListView'
    );
}
