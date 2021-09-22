import { mutator } from 'satcheljs';
import { setRoamingTimeZoneNotificationIsDisabled } from '../actions';
import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

mutator(setRoamingTimeZoneNotificationIsDisabled, actionMessage => {
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    userOptions.roamingTimeZoneNotificationsIsDisabled = actionMessage.isDisabled;
});
