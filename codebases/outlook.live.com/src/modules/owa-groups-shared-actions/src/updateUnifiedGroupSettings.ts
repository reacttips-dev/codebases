import { mutatorAction } from 'satcheljs/lib/simpleSubscribers';
import type { UnifiedGroupsSettings } from 'owa-groups-services/lib/getUnifiedGroupsSettings';
import { getUnifiedGroupsSettingsStore } from 'owa-groups-shared-store/lib/UnifiedGroupsSettingsStore';

export default mutatorAction(
    'updateUnifiedGroupSettings',
    function updateUnifiedGroupSettings(unifiedGroupSettings: UnifiedGroupsSettings) {
        const unifiedGroupsSettingsStore = getUnifiedGroupsSettingsStore();
        Object.keys(unifiedGroupSettings).forEach(function (key: string) {
            unifiedGroupsSettingsStore[key] = unifiedGroupSettings[key];
        });
    }
);
