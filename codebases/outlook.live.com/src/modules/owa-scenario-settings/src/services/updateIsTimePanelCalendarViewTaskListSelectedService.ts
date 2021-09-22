import type { IsTimePanelCalendarViewTaskListSelectedRequestType } from '../schema/ScenarioSettings/IsTimePanelCalendarViewTaskListSelected';
import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { makePatchRequest } from 'owa-ows-gateway';

export async function updateIsTimePanelCalendarViewTaskListSelectedService(
    isTimePanelCalendarViewTaskListSelected: boolean
): Promise<void> {
    const scenario = getSettingScenarioType('IsTimePanelCalendarViewTaskListSelected');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(
            scenario,
            'IsTimePanelCalendarViewTaskListSelected'
        );
        const isExpandedRequest: IsTimePanelCalendarViewTaskListSelectedRequestType = {
            isSelected: isTimePanelCalendarViewTaskListSelected,
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
