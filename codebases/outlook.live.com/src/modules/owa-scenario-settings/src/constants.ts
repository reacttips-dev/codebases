import type { SettingType } from './schema/SettingType';

export const SCENARIO_SETTINGS_URL: string = 'ows/beta/ScenarioSettings';

/* List of setting types that should have a consistent, shared value across all modules */
export const OWA_SCENARIO_SETTING_TYPES: SettingType[] = [
    'IsTimePanelDatePickerExpanded',
    'TimePanelCalendarIds',
    'IsTimePanelCalendarViewTaskListSelected',
];
