import type { ScenarioType } from '../schema/ScenarioType';
import { SCENARIO_SETTINGS_URL } from '../constants';

export function createGetScenarioSettingUrl(scenarios: ScenarioType[]): string {
    const str = scenarios.join(',');
    return `${SCENARIO_SETTINGS_URL}/?Scenarios=${str}`;
}
