import type { SettingItemResponseType } from '../SettingItemResponseType';

export interface IsTimePanelOpenRequestType {
    isOpen: boolean;
}

export interface IsTimePanelOpenResponseType extends SettingItemResponseType {
    isOpen: boolean;
}

export function isIsTimePanelOpenResponseType(
    response: SettingItemResponseType
): response is IsTimePanelOpenResponseType {
    return (
        (<IsTimePanelOpenResponseType>response).isOpen !== undefined &&
        response.settingName === 'IsTimePanelOpen'
    );
}
