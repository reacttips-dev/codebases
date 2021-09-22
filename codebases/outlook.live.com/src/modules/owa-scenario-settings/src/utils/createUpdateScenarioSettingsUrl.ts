import type { ScenarioType } from '../schema/ScenarioType';
import type { SettingType } from '../schema/SettingType';
import { SCENARIO_SETTINGS_URL } from '../constants';

export function createUpdateScenarioSettingUrl(
    scenario: ScenarioType,
    setting: SettingType
): string {
    return `${SCENARIO_SETTINGS_URL}/${scenario}/${setting}`;
}
