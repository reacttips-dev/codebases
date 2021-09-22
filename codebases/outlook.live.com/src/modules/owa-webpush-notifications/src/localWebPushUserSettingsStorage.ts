import type { LocalWebPushUserSetting } from './schema/LocalWebPushUserSetting';
import { getItem, setItem, removeItem } from 'owa-local-storage';

export const LOCAL_WEB_PUSH_USERSETTINGS_KEY: string = 'WebPushUserSettings';
export const MAX_LOCAL_WEB_PUSH_USER_SETTING: number = 5;

export function updateLocalWebPushUserSetting(
    windowObj: Window,
    localWebPushUserSetting: LocalWebPushUserSetting
) {
    let localSettings = getLocalWebPushUserSettings(windowObj);
    let insertIndex = -1;
    for (let i = 0; i < localSettings.length; ++i) {
        if (
            localSettings[i].userPreferenceIdentifier ==
            localWebPushUserSetting.userPreferenceIdentifier
        ) {
            insertIndex = i;
            break;
        }
    }

    if (insertIndex >= 0) {
        localSettings[insertIndex] = localWebPushUserSetting;
    } else {
        insertIndex = localSettings.length;
        if (localSettings.length >= MAX_LOCAL_WEB_PUSH_USER_SETTING) {
            insertIndex = 0;
            let minDate = new Date(localSettings[0].lastSessionDate);
            for (let i = 1; i < localSettings.length; ++i) {
                let currDate = new Date(localSettings[i].lastSessionDate);
                if (currDate.getTime() < minDate.getTime()) {
                    minDate = currDate;
                    insertIndex = i;
                }
            }
        }

        localSettings[insertIndex] = localWebPushUserSetting;
    }

    persistLocalWebPushUserSettings(windowObj, localSettings);
}

// Returns the most recent Local Web Push User Setting, which is used to initialize the notification checkbox option state
// This is in effort to persist the user preference for each notification type, and is retained whenever the server options change.
export function getLastLocalWebPushUserSetting(
    windowObj: Window,
    userPreferenceIdentifier: string
) {
    let localSettings = getLocalWebPushUserSettings(windowObj);
    let lastSetting = null;
    for (let i = 0; i < localSettings.length; ++i) {
        if (localSettings[i].userPreferenceIdentifier < userPreferenceIdentifier) {
            if (lastSetting) {
                if (
                    localSettings[i].userPreferenceIdentifier > lastSetting.userPreferenceIdentifier
                ) {
                    lastSetting = localSettings[i];
                }
            } else {
                lastSetting = localSettings[i];
            }
        }
    }

    return lastSetting;
}

export function getLocalWebPushUserSetting(windowObj: Window, userPreferenceIdentifier: string) {
    let localSettings = getLocalWebPushUserSettings(windowObj);
    let localSetting = null;
    for (let i = 0; i < localSettings.length; ++i) {
        if (localSettings[i].userPreferenceIdentifier == userPreferenceIdentifier) {
            localSetting = localSettings[i];
            break;
        }
    }

    return localSetting;
}

function getLocalWebPushUserSettings(windowObj: Window): Array<LocalWebPushUserSetting> {
    let rawUserSettings = getItem(windowObj, LOCAL_WEB_PUSH_USERSETTINGS_KEY);
    let localWebPushUserSettings: Array<LocalWebPushUserSetting> = new Array<LocalWebPushUserSetting>();
    try {
        let settings = JSON.parse(rawUserSettings);
        if (settings != null) {
            localWebPushUserSettings = settings;
        }
    } catch (e) {
        removeItem(windowObj, LOCAL_WEB_PUSH_USERSETTINGS_KEY);
    }

    return localWebPushUserSettings;
}

function persistLocalWebPushUserSettings(
    windowObj: Window,
    localWebPushUserSettings: Array<LocalWebPushUserSetting>
) {
    if (localWebPushUserSettings.length > 0) {
        let userSettingsJson = JSON.stringify(localWebPushUserSettings);
        setItem(windowObj, LOCAL_WEB_PUSH_USERSETTINGS_KEY, userSettingsJson);
    } else {
        removeItem(windowObj, LOCAL_WEB_PUSH_USERSETTINGS_KEY);
    }
}
