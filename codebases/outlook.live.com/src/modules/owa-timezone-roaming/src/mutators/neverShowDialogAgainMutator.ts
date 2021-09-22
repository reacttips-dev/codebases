import { mutator } from 'satcheljs';
import { neverShowDialogAgain } from '../actions';
import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

mutator(neverShowDialogAgain, () => {
    const userOptions = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    );

    userOptions.roamingTimeZoneNotificationsIsDisabled = true;
});
