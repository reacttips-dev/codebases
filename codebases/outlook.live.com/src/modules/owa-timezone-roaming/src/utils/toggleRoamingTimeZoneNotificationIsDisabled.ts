import { setRoamingTimeZoneNotificationIsDisabled } from '../actions';
import {
    lazyCreateOrUpdateOptionsForFeature,
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default function toggleRoamingTimeZoneNotificationIsDisabled(isDisabled: boolean) {
    // Update local store
    setRoamingTimeZoneNotificationIsDisabled(isDisabled);

    // Update OWS prime options
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.CalendarSurfaceOptions,
        {
            ...userOptions,
            roamingTimeZoneNotificationsIsDisabled: isDisabled,
        } as CalendarSurfaceOptions
    );
}
