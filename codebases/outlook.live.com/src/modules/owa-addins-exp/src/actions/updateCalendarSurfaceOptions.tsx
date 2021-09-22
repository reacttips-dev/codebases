import { action, mutator } from 'satcheljs';
import {
    OwsOptionsFeatureType,
    CalendarSurfaceAddinsOptions,
    lazyCreateOrUpdateOptionsForFeature,
} from 'owa-outlook-service-options';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { logAppPinningTelemetry } from 'owa-addins-analytics';

let updateCalendarSurfaceOptions = action(
    'updateCalendarSurfaceOptions',
    (calendarOptions: CalendarSurfaceAddinsOptions, calendarSurfaceAddinsToPin: Array<string>) => ({
        calendarOptions,
        calendarSurfaceAddinsToPin,
    })
);

mutator(updateCalendarSurfaceOptions, actionMessage => {
    for (const addinKey of actionMessage.calendarSurfaceAddinsToPin) {
        actionMessage.calendarOptions.calendarSurfaceAddins.push(addinKey);

        // Log 'AppPining' telemetry event for addin pinned.
        logAppPinningTelemetry(
            addinKey,
            true /* isPinned */,
            ExtensibilityModeEnum.AppointmentOrganizer
        );
    }

    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.CalendarSurfaceAddins,
        actionMessage.calendarOptions
    );
});

export default updateCalendarSurfaceOptions;
