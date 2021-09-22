import { createUpdateScenarioSettingUrl } from '../utils/createUpdateScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { makePatchRequest } from 'owa-ows-gateway';
import type {
    SelectedCalendarListViewRequestType,
    SelectedCalendarListViewType,
} from '../schema/ScenarioSettings/SelectedCalendarListView';

export async function updateSelectedCalendarListViewService(
    selectedView: SelectedCalendarListViewType
): Promise<void> {
    const scenario = getSettingScenarioType('SelectedCalendarListView');
    if (scenario) {
        const requestUrl = createUpdateScenarioSettingUrl(scenario, 'SelectedCalendarListView');
        const SelectedCalendarListView: SelectedCalendarListViewRequestType = {
            ViewType: selectedView,
        };
        await makePatchRequest(
            requestUrl,
            SelectedCalendarListView,
            undefined /* correlationId */,
            undefined /* returnFullResponse */,
            undefined /* customHeaders */,
            true /* throwServiceError */,
            undefined /* isThrottled */
        );
    }
}
