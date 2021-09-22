import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export function getRoamingTimeZoneNotificationIsDisabled(): boolean {
    return getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    ).roamingTimeZoneNotificationsIsDisabled;
}
