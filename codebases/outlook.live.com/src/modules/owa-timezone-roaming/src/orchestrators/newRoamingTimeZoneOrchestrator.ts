import { orchestrator } from 'satcheljs';
import { newRoamingTimeZone } from '../actions';
import {
    lazyCreateOrUpdateOptionsForFeature,
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

orchestrator(newRoamingTimeZone, actionMessage => {
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.CalendarSurfaceOptions,
        {
            ...userOptions,
            lastKnownRoamingTimeZone: actionMessage.timeZone,
        } as CalendarSurfaceOptions
    );
});
