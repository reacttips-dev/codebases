import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { makePatchRequest } from 'owa-ows-gateway';

export async function updateShouldAutoOpenTimePanelService(
    isTimePanelOpen: boolean
): Promise<void> {
    const scenario = getSettingScenarioType('IsTimePanelOpen');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(scenario, 'IsTimePanelOpen');
        const IsTimePanelOpenBody = { IsOpen: isTimePanelOpen };
        await makePatchRequest(
            requestUrl,
            IsTimePanelOpenBody,
            undefined /* correlationId */,
            undefined /* returnFullResponse */,
            undefined /* customHeaders */,
            true /* throwServiceError */,
            undefined /* isThrottled */
        );
    }
}
