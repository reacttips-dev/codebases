import { getWorkloadScenarioType } from './getWorkloadScenarioType';
import { isSupportedWorkload } from './isSupportedWorkload';
import { OWA_SCENARIO_SETTING_TYPES } from '../constants';
import type { ScenarioType } from '../schema/ScenarioType';
import type { SettingType } from '../schema/SettingType';
import { getOwaWorkload } from 'owa-workloads';

/**
 * Returns the applicable scenario type that should be used to read and write values
 * for a given setting type, or null if read/write is not supported for any scenarios
 */
export function getSettingScenarioType(setting: SettingType): ScenarioType | null {
    // if setting should be consistent across all modules, use the 'Owa' scenario
    if (OWA_SCENARIO_SETTING_TYPES.some(owaSetting => owaSetting === setting)) {
        return 'Owa';
    }
    // else if the workload is supported, use the workload scenario
    const workload = getOwaWorkload();
    if (isSupportedWorkload(workload)) {
        return getWorkloadScenarioType(workload);
    }

    // otherwise signal that no scenario is supported
    return null;
}
