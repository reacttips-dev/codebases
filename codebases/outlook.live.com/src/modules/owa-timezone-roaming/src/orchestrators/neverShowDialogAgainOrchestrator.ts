import { orchestrator } from 'satcheljs';
import { neverShowDialogAgain } from '../actions';
import {
    lazyCreateOrUpdateOptionsForFeature,
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

orchestrator(neverShowDialogAgain, () => {
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.CalendarSurfaceOptions,
        {
            ...userOptions,
            roamingTimeZoneNotificationsIsDisabled: true,
        } as CalendarSurfaceOptions
    );
});
