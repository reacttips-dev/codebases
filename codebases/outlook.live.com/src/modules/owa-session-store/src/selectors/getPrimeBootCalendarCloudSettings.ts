import getUserConfiguration from '../actions/getUserConfiguration';

const CALENDAR_CLOUD_SETTINGS_ID = 'CalendarCloudSettings';

/**
 * Gets the calendar cloud settings from the prime boot settings.
 */
export function getPrimeBootCalendarCloudSettings(): any[] | undefined {
    const primeSettingsItems = getUserConfiguration()?.PrimeSettings?.Items;
    const primeCalendarCloudSettings: any = primeSettingsItems?.filter(
        item => item?.Id == CALENDAR_CLOUD_SETTINGS_ID
    );
    const primeCalendarCloudSettingsValue: any = primeCalendarCloudSettings?.[0]?.Value;
    const calendarCloudSettings: any[] = [];

    primeCalendarCloudSettingsValue?.forEach(setting => {
        calendarCloudSettings.push({
            name: setting.name,
            value: setting.value,
            source: setting.source,
        });
    });

    return calendarCloudSettings;
}
