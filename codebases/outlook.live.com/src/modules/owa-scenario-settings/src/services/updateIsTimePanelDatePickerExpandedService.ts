import type { IsTimePanelDatePickerExpandedRequestType } from '../schema/ScenarioSettings/IsTimePanelDatePickerExpanded';
import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { makePatchRequest } from 'owa-ows-gateway';

export async function updateIsTimePanelDatePickerExpandedService(
    isTimePanelDatePickerExpanded: boolean
): Promise<void> {
    const scenario = getSettingScenarioType('IsTimePanelDatePickerExpanded');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(
            scenario,
            'IsTimePanelDatePickerExpanded'
        );
        const isExpandedRequest: IsTimePanelDatePickerExpandedRequestType = {
            isExpanded: isTimePanelDatePickerExpanded,
        };
        await makePatchRequest(
            requestUrl,
            isExpandedRequest,
            undefined /* correlationId */,
            undefined /* returnFullResponse */,
            undefined /* customHeaders */,
            true /* throwServiceError */,
            undefined /* isThrottled */
        );
    }
}
