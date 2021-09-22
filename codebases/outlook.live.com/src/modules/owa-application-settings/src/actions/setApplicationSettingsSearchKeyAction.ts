import { action } from 'satcheljs';

const SET_APPLICATION_SETTINGS_SEARCH_KEY = 'setApplicationSettingsSearchKey';

const setApplicationSettingsSearchKeyAction = action(
    SET_APPLICATION_SETTINGS_SEARCH_KEY,
    (key: string) => ({
        key,
    })
);

export default setApplicationSettingsSearchKeyAction;
