import type { SettingItemResponseType } from '../SettingItemResponseType';

export interface IsTimePanelDatePickerExpandedRequestType {
    isExpanded: boolean;
}

export interface IsTimePanelDatePickerExpandedResponseType extends SettingItemResponseType {
    isExpanded: boolean;
}

export function isIsTimePanelDatePickerExpandedResponseType(
    response: SettingItemResponseType
): response is IsTimePanelDatePickerExpandedResponseType {
    return (
        (<IsTimePanelDatePickerExpandedResponseType>response).isExpanded !== undefined &&
        response.settingName === 'IsTimePanelDatePickerExpanded'
    );
}
