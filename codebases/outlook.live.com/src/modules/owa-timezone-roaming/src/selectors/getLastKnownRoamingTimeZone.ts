import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export function getLastKnownRoamingTimeZone(): string | null {
    return getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    ).lastKnownRoamingTimeZone;
}
