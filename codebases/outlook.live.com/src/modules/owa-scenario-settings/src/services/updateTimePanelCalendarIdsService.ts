import type { TimePanelCalendarIdsRequestType } from '../schema/ScenarioSettings/TimePanelCalendarIds';
import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { createRestApiRequestHeaders } from 'owa-headers';
import { makePatchRequest } from 'owa-ows-gateway';

export async function updateTimePanelCalendarIdsService(
    calendarIds: string[],
    userIdentity: string
): Promise<void> {
    const scenario = getSettingScenarioType('TimePanelCalendarIds');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(scenario, 'TimePanelCalendarIds');
        const timePanelCalendarIds: TimePanelCalendarIdsRequestType = { CalendarIds: calendarIds };
        await makePatchRequest(
            requestUrl,
            timePanelCalendarIds,
            undefined /* correlationId */,
            undefined /* returnFullResponse */,
            await createRestApiRequestHeaders(userIdentity) /* customHeaders */,
            true /* throwServiceError */,
            undefined /* includeCredentials */,
            'UpdateTimePanelCalendarIdsRequest' /* actionName */
        );
    }
}
