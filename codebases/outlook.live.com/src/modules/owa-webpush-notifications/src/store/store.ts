import type { LocalWebPushUserSetting } from '../schema/LocalWebPushUserSetting';
import { createStore } from 'satcheljs';
import { WebPushViewState, WebPushWorkflowView } from './schema/WebPushViewState';

export { WebPushWorkflowView } from './schema/WebPushViewState';
export type { WebPushViewState } from './schema/WebPushViewState';

export const webPushStore = createStore<WebPushViewState>('webPushStore', {
    currentView: WebPushWorkflowView.None,
    webPushPermission: window.Notification?.permission,
})();

export const localWebPushUserSettingStore = createStore<LocalWebPushUserSetting>(
    'localWebPushUserSettingStore',
    {
        userPreferenceIdentifier: null,
        lastSessionDate: null,
        uniqueDaysSessionCount: 0,
        enabled: null,
        mailEnabled: null,
        reminderEnabled: null,
        vipMailEnabled: null,
        lastCheckboxUnchecked: null,
        promptCount: 0,
        lastPromptDate: null,
    }
)();

export function getLocalWebPushUserSettingStore(): LocalWebPushUserSetting {
    return localWebPushUserSettingStore;
}
