import { localWebPushUserSettingStore } from './store/store';
import { getDate } from './utils/getDate';
import { action } from 'satcheljs/lib/legacy';
import {
    updateLocalWebPushUserSetting,
    getLocalWebPushUserSetting,
    getLastLocalWebPushUserSetting,
} from './localWebPushUserSettingsStorage';
import { isAnyWebPushTypeLocallyEnabled } from './localWebPushUserSettingSelectors';
import {
    LocalWebPushUserSetting,
    WebPushNotificationTypes,
} from './schema/LocalWebPushUserSetting';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface LocalWebPushUserSettingState {
    store: LocalWebPushUserSetting;
}

export const MAX_UNIQUEDAYS_SESSION_COUNT_FOR_PROMPT: number = 4;
export const MAX_ENABLE_WEBPUSH_PROMPT_COUNT: number = 3;

export const loadLocalWebPushUserSetting = action('loadLocalWebPushUserSetting')(
    function loadLocalWebPushUserSetting(
        windowObj: Window,
        userPreferenceIdentifier: string,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        let persistedLocalSetting = getLocalWebPushUserSetting(windowObj, userPreferenceIdentifier);
        if (persistedLocalSetting != null) {
            Object.keys(persistedLocalSetting).forEach(k => {
                state.store[k] = persistedLocalSetting[k];
            });
            validateAndUpdateCheckboxOptions(windowObj);
        } else {
            // Any time the web push server option is updated, either enabled/disabled, the userPreferenceIdentifier
            // changes (userPreferenceIdentifier = mbxGuid + '_' + options.enabledTimeInUTCMs). This can happen in the
            // following two cases:
            // 1. User disabled notification on all devices
            // 2. User enables notification for the first time (or enables it after disabling on all devices)
            // Whenever the server options update, the LocalWebPushUserSetting gets initialized with default values.
            // However we still want to persist the checkbox option state, radio button state and the lastCheckboxUnchecked.
            // So that we can initialize the checkbox option using the user's last selection.
            // For this we try to get the most recent LocalWebPushUserSetting and initialize checkbox options from those,
            // if we found any in the local browser storage. If not, the store is initialized with default value.
            let lastLocalSetting = getLastLocalWebPushUserSetting(
                windowObj,
                userPreferenceIdentifier
            );
            if (lastLocalSetting) {
                state.store.lastCheckboxUnchecked = lastLocalSetting.lastCheckboxUnchecked;
                state.store.mailEnabled = lastLocalSetting.mailEnabled;
                state.store.reminderEnabled = lastLocalSetting.reminderEnabled;
                state.store.vipMailEnabled = lastLocalSetting.vipMailEnabled;
            }
            state.store.userPreferenceIdentifier = userPreferenceIdentifier;
            updateLocalWebPushUserSetting(windowObj, state.store);
        }
    }
);

export const incrementUniqueDaysSessionCount = action('incrementUniqueDaysSessionCount')(
    function incrementUniqueDaysSessionCount(
        windowObj: Window,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        let today = getDate().toDateString();
        if (state.store.lastSessionDate != today) {
            state.store.lastSessionDate = today;
            if (state.store.uniqueDaysSessionCount < MAX_UNIQUEDAYS_SESSION_COUNT_FOR_PROMPT) {
                state.store.uniqueDaysSessionCount++;
            }
            updateLocalWebPushUserSetting(windowObj, state.store);
        }
    }
);

export const resetLocalWebpushUserSetting = action('resetLocalWebpushUserSetting')(
    function resetLocalWebpushUserSetting(
        windowObj: Window,
        userPreferenceIdentifier: string,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        // Persist users settings for mailEnabled, reminderEnabled, vipMailEnabled and lastCheckboxUnchecked.
        // As these will be used to initialize the state for future sessions.
        // Reset all the other properties
        state.store.userPreferenceIdentifier = userPreferenceIdentifier;
        // Setting this to false instead of null so that user is not prompted again on this device + browser.
        // Atleast untill the server options change.
        state.store.enabled = false;
        state.store.promptCount = 0;
        state.store.lastPromptDate = null;
        state.store.uniqueDaysSessionCount = 0;
        updateLocalWebPushUserSetting(windowObj, state.store);
    }
);

export const updateLocalWebPushEnabledStatus = action('updateLocalWebPushEnabledStatus')(
    function updateLocalWebPushEnabledStatus(
        windowObj: Window,
        enabled: boolean,
        userPreferenceIdentifier: string,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        state.store.enabled = enabled;
        state.store.userPreferenceIdentifier = userPreferenceIdentifier;
        if (enabled) {
            validateAndUpdateCheckboxOptions(windowObj);
        }
        updateLocalWebPushUserSetting(windowObj, state.store);
    }
);

export const incrementLocalWebPushPromptCount = action('incrementLocalWebPushPromptCount')(
    function incrementLocalWebPushPromptCount(
        windowObj: Window,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        state.store.promptCount++;
        state.store.lastPromptDate = getDate().toDateString();
        updateLocalWebPushUserSetting(windowObj, state.store);
    }
);

export const resetLocalWebPushPromptCount = action('resetLocalWebPushPromptCount')(
    function resetLocalWebPushPromptCount(
        windowObj: Window,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        state.store.promptCount = 0;
        state.store.lastPromptDate = null;
        updateLocalWebPushUserSetting(windowObj, state.store);
    }
);

export const validateAndUpdateCheckboxOptions = action('validateAndUpdateCheckboxOptions')(
    function validateAndUpdateCheckboxOptions(
        windowObj: Window,
        state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
    ) {
        if (state.store.enabled) {
            if (!isAnyWebPushTypeLocallyEnabled()) {
                if (state.store.lastCheckboxUnchecked) {
                    switch (state.store.lastCheckboxUnchecked) {
                        case WebPushNotificationTypes.NewMail:
                            state.store.mailEnabled = true;
                            break;
                        case WebPushNotificationTypes.Reminder:
                            state.store.reminderEnabled = true;
                    }
                    //reset the last unchecked checkbox.
                    state.store.lastCheckboxUnchecked = null;
                } else {
                    state.store.mailEnabled = true;
                    state.store.reminderEnabled = true;
                }
            }
            // Enabled the reminder option by default, if user has enabled mail option.
            // Reminder option will be false (and not null) if user has explicitely disabled it.
            if (
                state.store.mailEnabled == true &&
                (state.store.reminderEnabled == null || state.store.reminderEnabled == undefined)
            ) {
                state.store.reminderEnabled = true;
            }
        }
        // Disable the reminder option and set the lastCheckboxUnchecked to false, if reminder feature
        // flag is not enabled.
        if (
            !isFeatureEnabled('auth-scheduleTimerForReminderWebPush') &&
            !isFeatureEnabled('auth-sendReminderWebPush')
        ) {
            state.store.reminderEnabled = null;
            state.store.lastCheckboxUnchecked = null;
        }
        updateLocalWebPushUserSetting(windowObj, state.store);
    }
);
