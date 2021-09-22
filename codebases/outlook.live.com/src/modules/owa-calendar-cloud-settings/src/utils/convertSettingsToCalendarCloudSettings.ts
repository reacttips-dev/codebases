import type CalendarCloudSetting from '../store/schema/CalendarCloudSetting';
import { CalendarCloudSettingType } from '../store/schema/CalendarCloudSettingType';
import normalizeShortenEventScopeValue from '../utils/normalizeShortenEventScopeValue';

/**
 * Converts the OCS settings or prime settings to the CalendarCloudSettings
 * @param settings
 */
export default function convertSettingsToCalendarCloudSettings(
    settings: any[] | undefined
): CalendarCloudSetting[] | null {
    if (!settings || settings.length == 0) {
        return null;
    }

    const calendarCloudSettings: CalendarCloudSetting[] = [];
    let settingValue;

    settings.forEach(setting => {
        if (!setting.name || !setting.value) {
            return;
        }

        switch (setting.name.toLowerCase()) {
            case CalendarCloudSettingType.ShouldEventsEndEarly.toLowerCase():
                settingValue = setting.value.toLowerCase() === 'true';
                break;
            case CalendarCloudSettingType.ShortenEventScope.toLowerCase():
                settingValue = normalizeShortenEventScopeValue(setting.value);
                break;
            case CalendarCloudSettingType.EndShortEventsBy.toLowerCase():
                settingValue = +setting.value;
                break;
            case CalendarCloudSettingType.EndLongEventsBy.toLowerCase():
                settingValue = +setting.value;
                break;
            case CalendarCloudSettingType.EnableOnlineMeetingsByDefault.toLowerCase():
                settingValue = setting.value.toLowerCase() === 'true';
                break;
        }

        // Check for null or undefined values
        if (settingValue != null) {
            calendarCloudSettings.push({
                name: setting.name,
                value: settingValue,
                source: setting.source,
            });
        }
    });

    return calendarCloudSettings.length === 0 ? null : calendarCloudSettings;
}
