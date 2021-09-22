import updateUnifiedGroupSettings from './updateUnifiedGroupSettings';
import getUnifiedGroupsSettings, {
    ResponseCode,
} from 'owa-groups-services/lib/getUnifiedGroupsSettings';
import { action, orchestrator } from 'satcheljs';

const loadUnifiedGroupsSettings = action('loadUnifiedGroupsSettings');

orchestrator(loadUnifiedGroupsSettings, async () => {
    const unifiedGroupSettingsResponse = await getUnifiedGroupsSettings();
    if (
        unifiedGroupSettingsResponse?.unifiedGroupSettings &&
        unifiedGroupSettingsResponse.responseCode === ResponseCode.Success
    ) {
        updateUnifiedGroupSettings(unifiedGroupSettingsResponse.unifiedGroupSettings);
    }
});

export default loadUnifiedGroupsSettings;
