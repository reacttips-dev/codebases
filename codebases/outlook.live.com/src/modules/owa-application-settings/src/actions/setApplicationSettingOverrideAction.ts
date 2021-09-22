import { action } from 'satcheljs';

const SET_APPLICATION_SETTING_OVERRIDE_ACTION = 'setApplicationSettingOverride';

const setApplicationSettingOverrideAction = action(
    SET_APPLICATION_SETTING_OVERRIDE_ACTION,
    (setting: string, value: any) => ({
        setting,
        value,
    })
);

export default setApplicationSettingOverrideAction;
