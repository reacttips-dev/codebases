import { mutator } from 'satcheljs';
import { newRoamingTimeZone } from '../actions';
import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

mutator(newRoamingTimeZone, actionMessage => {
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    userOptions.lastKnownRoamingTimeZone = actionMessage.timeZone;
});
