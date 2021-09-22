import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { makePatchRequest } from 'owa-ows-gateway';
import type {
    TimePanelSelectedViewRequestType,
    TimePanelSelectedViewType,
} from '../schema/ScenarioSettings/TimePanelSelectedView';

export async function updateTimePanelSelectedViewService(
    selectedView: TimePanelSelectedViewType
): Promise<void> {
    const scenario = getSettingScenarioType('TimePanelSelectedView');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(scenario, 'TimePanelSelectedView');
        const timePanelSelectedView: TimePanelSelectedViewRequestType = { ViewType: selectedView };
        await makePatchRequest(
            requestUrl,
            timePanelSelectedView,
            undefined /* correlationId */,
            undefined /* returnFullResponse */,
            undefined /* customHeaders */,
            true /* throwServiceError */,
            undefined /* isThrottled */
        );
    }
}
