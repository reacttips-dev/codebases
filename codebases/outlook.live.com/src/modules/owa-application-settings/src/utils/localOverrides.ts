import { getItem, setItem, removeItem } from 'owa-local-storage';

const APPLICATION_SETTING_OVERRIDES_LOCAL_STORAGE_KEY = 'applicationSettingOverrides';

export const getLocalOverrides = () => {
    const localOverrides = getItem(window, APPLICATION_SETTING_OVERRIDES_LOCAL_STORAGE_KEY);

    if (localOverrides) {
        try {
            return JSON.parse(localOverrides);
        } catch (e) {
            return {};
        }
    }

    return {};
};

export const setLocalOverride = (setting, value) => {
    const localOverrides = getLocalOverrides();

    localOverrides[setting] = value;

    setItem(
        window,
        APPLICATION_SETTING_OVERRIDES_LOCAL_STORAGE_KEY,
        JSON.stringify(localOverrides)
    );
};

export const resetLocalOverrides = () => {
    removeItem(window, APPLICATION_SETTING_OVERRIDES_LOCAL_STORAGE_KEY);
};
