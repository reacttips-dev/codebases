import { action } from 'satcheljs';
import type { Settings } from '../schema/ScenarioSettings';

export const workloadScenarioSettingsLoaded = action(
    'WORKLOAD_SCENARIO_SETTINGS_LOADED',
    (settings: Settings, userIdentity: string) => ({
        settings: settings,
        userIdentity: userIdentity,
    })
);

export const loadingWorkloadScenarioSettingsFailed = action(
    'LOADING_WORKLOAD_SCENARIO_SETTINGS_FAILED',
    (userIdentity: string) => ({
        userIdentity,
    })
);
