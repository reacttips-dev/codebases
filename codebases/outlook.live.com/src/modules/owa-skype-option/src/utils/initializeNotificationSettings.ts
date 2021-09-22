import { convertSwcSettingTypeToOws, NotificationSettingType } from './swcNotificationUtils';
import updateSkypeUserOption from '../data/mutators/updateSkypeUserOption';
import getSwcSettingsStore from '../data/store/swcStore';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function initializeNotificationSettings() {
    if (isFeatureEnabled('fwk-skypeConsumer')) {
        // If OWS' settings are migrated, update the local SWC store with SWC settings
        updateSwcStoreWithSettings();
    }
}

function updateSwcStoreWithSettings(): void {
    window.swc.getNotificationSettings().then(proxy => {
        const swcSettingsStore = getSwcSettingsStore();
        proxy.readOption(NotificationSettingType.IncomingCall).then(status => {
            updateSkypeUserOption(
                swcSettingsStore,
                'skypeCallingNotification',
                convertSwcSettingTypeToOws(status.value)
            );
        });
        proxy.readOption(NotificationSettingType.NewMessage).then(status => {
            updateSkypeUserOption(
                swcSettingsStore,
                'skypeMessageNotification',
                convertSwcSettingTypeToOws(status.value)
            );
        });
    });
}
