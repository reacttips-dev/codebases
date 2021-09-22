import type Extension from 'owa-service/lib/contract/Extension';
import { getMailReadSurfaceAddinsToPin } from './getMailReadSurfaceAddinsToPin';
import { getMailComposeSurfaceAddinsToPin } from './getMailComposeSurfaceAddinsToPin';
import { getCalendarSurfaceAddinsToPin } from './getCalendarSurfaceAddinsToPin';
import {
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
    CalendarSurfaceAddinsOptions,
    lazyGetServerOptionsForFeature,
} from 'owa-outlook-service-options';
import updateMailSurfaceOptions from '../actions/updateMailSurfaceOptions';
import updateCalendarSurfaceOptions from '../actions/updateCalendarSurfaceOptions';

// This function pins given addins ids to all surfaces. Addin Ids are expected
// to be newly installed admin addin ids.
//
// Treatment-1: Pin new admin installed addins
//
// @param addins List of addins (Extension) received in GetExtensibilityContext response.
export async function pinNewAdminInstalledAddinsExp(
    addins: Extension[],
    newAdminInstalledAddins: string[]
) {
    if (newAdminInstalledAddins.length <= 0) {
        // No new Admin installed addins found.
        return;
    }

    let getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();

    let mailOptions: SurfaceActionsOptions = await getServerOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );

    // Mail Read
    let mailReadSurfaceAddinsToPin = getMailReadSurfaceAddinsToPin(
        addins,
        newAdminInstalledAddins,
        mailOptions.readSurfaceAddins
    );

    // Mail Compose
    let mailComposeSurfaceAddinsToPin = getMailComposeSurfaceAddinsToPin(
        addins,
        newAdminInstalledAddins,
        mailOptions.composeSurfaceAddins
    );

    // Calendar
    let calendarOptions: CalendarSurfaceAddinsOptions = await getServerOptionsForFeature<CalendarSurfaceAddinsOptions>(
        OwsOptionsFeatureType.CalendarSurfaceAddins
    );

    let calendarSurfaceAddinsToPin = getCalendarSurfaceAddinsToPin(
        addins,
        newAdminInstalledAddins,
        calendarOptions.calendarSurfaceAddins
    );

    if (mailReadSurfaceAddinsToPin.length > 0 || mailComposeSurfaceAddinsToPin.length > 0) {
        updateMailSurfaceOptions(
            mailOptions,
            mailReadSurfaceAddinsToPin,
            mailComposeSurfaceAddinsToPin
        );
    }

    if (calendarSurfaceAddinsToPin.length > 0) {
        updateCalendarSurfaceOptions(calendarOptions, calendarSurfaceAddinsToPin);
    }
}
