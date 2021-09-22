import type { Settings } from '../schema/ScenarioSettings';
import { isIsTimePanelDatePickerExpandedResponseType } from '../schema/ScenarioSettings/IsTimePanelDatePickerExpanded';
import { isIsTimePanelCalendarViewTaskListSelectedResponseType } from '../schema/ScenarioSettings/IsTimePanelCalendarViewTaskListSelected';
import { isIsTimePanelOpenResponseType } from '../schema/ScenarioSettings/IsTimePanelOpen';
import { isSelectedCalendarListViewResponseType } from '../schema/ScenarioSettings/SelectedCalendarListView';
import { isTimePanelCalendarIdsResponseType } from '../schema/ScenarioSettings/TimePanelCalendarIds';
import { isTimePanelSelectedViewResponseType } from '../schema/ScenarioSettings/TimePanelSelectedView';
import type { ScenarioType } from '../schema/ScenarioType';
import type { SettingItemResponseType } from '../schema/SettingItemResponseType';
import { createGetScenarioSettingUrl } from '../utils/createGetScenarioSettingsUrl';
import { getSettingScenarioType } from '../utils/getSettingScenarioType';
import { getWorkloadScenarioType } from '../utils/getWorkloadScenarioType';
import { isSupportedWorkload } from '../utils/isSupportedWorkload';
import { createRestApiRequestHeaders } from 'owa-headers';
import { makeGetRequest } from 'owa-ows-gateway';
import { getOwaWorkload } from 'owa-workloads';

interface GetWorkloadScenarioSettingsResponse {
    settings?: SettingItemResponseType[];
}

/** get the settings for the current workload, and non-workload specific 'Owa' settings */
export async function getWorkloadScenarioSettings(userIdentity: string): Promise<Settings> {
    // get the settings url request for OWA and the current module
    const scenarios: ScenarioType[] = ['Owa'];
    const workload = getOwaWorkload();
    if (isSupportedWorkload(workload)) {
        const scenario = getWorkloadScenarioType(workload);
        scenarios.push(scenario);
    }
    const getUrl = createGetScenarioSettingUrl(scenarios);
    const result: GetWorkloadScenarioSettingsResponse = await makeGetRequest(
        getUrl,
        undefined /* correlationId */,
        undefined /* returnFullResponse */,
        await createRestApiRequestHeaders(userIdentity) /* customHeaders */,
        true /* throwServiceError */,
        undefined /* includeCredentials */,
        'GET_WORKLOAD_SCENARIO_SETTINGS'
    );

    const settings: Settings = {
        timePanelSelectedView: null,
        timePanelCalendarIds: [],
        timePanelSelectedCalendarView: null,
        isTimePanelOpen: false,
        isTimePanelDatePickerExpanded: false,
        isTimePanelCalendarViewTaskListSelected: true,
    };

    result?.settings?.forEach(setting => {
        const settingScenario = getSettingScenarioType(setting.settingName);
        if (
            isTimePanelCalendarIdsResponseType(setting) &&
            settingScenario === getSettingScenarioType('TimePanelCalendarIds')
        ) {
            settings.timePanelCalendarIds = setting.calendarIds;
        } else if (
            isTimePanelSelectedViewResponseType(setting) &&
            settingScenario === getSettingScenarioType('TimePanelSelectedView')
        ) {
            settings.timePanelSelectedView = setting.selectedView;
        } else if (
            isSelectedCalendarListViewResponseType(setting) &&
            settingScenario === getSettingScenarioType('SelectedCalendarListView')
        ) {
            settings.timePanelSelectedCalendarView = setting.selectedView;
        } else if (
            isIsTimePanelOpenResponseType(setting) &&
            settingScenario === getSettingScenarioType('IsTimePanelOpen')
        ) {
            settings.isTimePanelOpen = setting.isOpen;
        } else if (
            isIsTimePanelDatePickerExpandedResponseType(setting) &&
            settingScenario === getSettingScenarioType('IsTimePanelDatePickerExpanded')
        ) {
            settings.isTimePanelDatePickerExpanded = setting.isExpanded;
        } else if (
            isIsTimePanelCalendarViewTaskListSelectedResponseType(setting) &&
            settingScenario === getSettingScenarioType('IsTimePanelCalendarViewTaskListSelected')
        ) {
            settings.isTimePanelCalendarViewTaskListSelected = setting.isSelected;
        }
    });
    return settings;
}
