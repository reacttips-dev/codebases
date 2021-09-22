import type { SettingItemResponseType } from '../SettingItemResponseType';

// The is a server defined type, and should be kept in sync.
// In the server-ows-api project: src/Microsoft.OWS.ScenarioSettings/Models/ScenarioSettings/TimePanelSelectedViewType.cs
export type TimePanelSelectedViewType = 'Tasks' | 'Calendar';

export interface TimePanelSelectedViewRequestType {
    ViewType: TimePanelSelectedViewType;
}

export interface TimePanelSelectedViewResponseType extends SettingItemResponseType {
    selectedView: TimePanelSelectedViewType;
}

export function isTimePanelSelectedViewResponseType(
    response: SettingItemResponseType
): response is TimePanelSelectedViewResponseType {
    return (
        !!(<TimePanelSelectedViewResponseType>response).selectedView &&
        response.settingName === 'TimePanelSelectedView'
    );
}
