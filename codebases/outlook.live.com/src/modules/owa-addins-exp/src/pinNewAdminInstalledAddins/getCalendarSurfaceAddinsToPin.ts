import type Extension from 'owa-service/lib/contract/Extension';
import {
    ExtensibilityModeEnum,
    AddinTeachingUICalloutGoalEnum,
    AddinTeachingUICalloutActionEnum,
} from 'owa-addins-types';
import { getExtensionPoint, updateCalendarSurfaceNewAddin } from 'owa-addins-store';
import { logAppTeachingUICalloutTelemetry } from 'owa-addins-analytics';

export function getCalendarSurfaceAddinsToPin(
    addins: Extension[],
    newAdminInstalledAddins: string[],
    calendarSurfacePinnedAddins: string[]
): string[] {
    if (calendarSurfacePinnedAddins.length >= 3) {
        // User already has 3 or more addins pinned. We cannot pin more.
        return [];
    }

    // Filter MailRead surface addins from newAdminInstalledAddins.
    let totalAddinsPinned: number = calendarSurfacePinnedAddins.length;
    let mailCalSurfaceAddinToPin: string[] = [];

    // Add admin addin keys in 'surfaceAddinKeys' until count reaches 3.
    // Also, find out latest addin which we added in surfaceAddinKeys.
    let latestAddinKey: string;

    for (const addinKey of newAdminInstalledAddins) {
        const addinKeyLowerCase = addinKey.toLowerCase();

        if (totalAddinsPinned >= 3) {
            break;
        }

        if (calendarSurfacePinnedAddins.includes(addinKeyLowerCase)) {
            // This addin is already pinned, skip it.
            continue;
        }

        for (const addin of addins) {
            if (addinKeyLowerCase != addin.Id.toLowerCase()) {
                continue;
            }

            if (!addin.ExtensionPointCollection) {
                continue;
            }

            let attendeeExtensionPoint = getExtensionPoint(
                addin.ExtensionPointCollection,
                ExtensibilityModeEnum.AppointmentAttendee
            );

            let organizerExtensionPoint = getExtensionPoint(
                addin.ExtensionPointCollection,
                ExtensibilityModeEnum.AppointmentOrganizer
            );

            if (!attendeeExtensionPoint && !organizerExtensionPoint) {
                continue;
            }

            // Found required addin. Add it to list of addins to pin.
            mailCalSurfaceAddinToPin.push(addinKeyLowerCase);
            ++totalAddinsPinned;

            if (!latestAddinKey) {
                latestAddinKey = addinKeyLowerCase;
            } else {
                // Not selecting this addin for showing Teaching UI Callout.
                logAppTeachingUICalloutTelemetry(
                    addinKey,
                    AddinTeachingUICalloutGoalEnum.NewAdminDeployment,
                    AddinTeachingUICalloutActionEnum.MissNotSelected,
                    ExtensibilityModeEnum.AppointmentOrganizer
                );
            }

            // Pick next addin from newAdminInstalledAddins.
            break;
        }
    }

    // Save latestAddinKey in ExtensibilityState.
    updateCalendarSurfaceNewAddin(latestAddinKey);

    return mailCalSurfaceAddinToPin;
}
