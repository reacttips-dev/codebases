import { localWebPushUserSettingStore } from './store/store';
import { getDate } from './utils/getDate';
import type WebPushNotificationTypesState from './schema/WebPushNotificationTypesState';

import {
    MAX_UNIQUEDAYS_SESSION_COUNT_FOR_PROMPT,
    MAX_ENABLE_WEBPUSH_PROMPT_COUNT,
    LocalWebPushUserSettingState,
} from './localWebPushUserSettingActions';

export const shouldPromptUserToEnableWebPush = function shouldPromptUserToEnableWebPush(
    state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
): boolean {
    return (
        state.store != null &&
        state.store.enabled == undefined &&
        state.store.uniqueDaysSessionCount >= MAX_UNIQUEDAYS_SESSION_COUNT_FOR_PROMPT &&
        state.store.lastPromptDate != getDate().toDateString() &&
        state.store.promptCount <= MAX_ENABLE_WEBPUSH_PROMPT_COUNT
    );
};

export const isAnyWebPushTypeLocallyEnabled = function isAnyWebPushTypeLocallyEnabled(
    state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
): boolean {
    return state.store.mailEnabled || state.store.reminderEnabled;
};

export const getWebPushNotificationTypesState = function getWebPushNotificationTypesState(
    state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
): WebPushNotificationTypesState {
    return {
        newMail: state.store.mailEnabled ?? false,
        reminder: state.store.reminderEnabled ?? false,
        vipMailOnly: state.store.vipMailEnabled ?? false,
    };
};

export const isReminderWebPushLocallyEnabled = function isReminderWebPushLocallyEnabled(
    state: LocalWebPushUserSettingState = { store: localWebPushUserSettingStore }
): boolean {
    return state.store.reminderEnabled && state.store.enabled;
};
