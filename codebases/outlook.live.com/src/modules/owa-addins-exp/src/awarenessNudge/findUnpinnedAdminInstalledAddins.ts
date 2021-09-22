import type Extension from 'owa-service/lib/contract/Extension';
import { getAdminInstalledAddins } from '../pinNewAdminInstalledAddins/getNewAdminInstalledAddins';
import {
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
    CalendarSurfaceAddinsOptions,
    lazyGetServerOptionsForFeature,
} from 'owa-outlook-service-options';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { updateUnpinnedAdminAddins } from 'owa-addins-store';

/* The below function finds and stores unpinned admin addins and stores them to Ext store
 * The results will be used to show callouts and highlight addins in overflow menu
 * @param addins => List of addins received as a response of getExtContext call
 */
export async function findUnpinnedAdminInstalledAddins(addins: Extension[]) {
    const allAdminAddins: string[] = getAdminInstalledAddins(addins);

    if (!allAdminAddins) {
        // No admin installed add-ins detected
        return;
    }

    // mail
    const getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();
    const mailOptions: SurfaceActionsOptions = await getServerOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );

    // Read surface
    const readSurfaceUnpinnedAdminAddins = getAdminInstalledUnpinnedAddins(
        allAdminAddins,
        mailOptions.readSurfaceAddins
    );
    if (readSurfaceUnpinnedAdminAddins.length > 0) {
        // Update getExt store with unpinned admin addins for read surface
        updateUnpinnedAdminAddins(
            readSurfaceUnpinnedAdminAddins,
            ExtensibilityModeEnum.MessageRead
        );
    }

    // Compose surface
    const composeSurfaceUnpinnedAdminAddins = getAdminInstalledUnpinnedAddins(
        allAdminAddins,
        mailOptions.composeSurfaceAddins
    );
    if (composeSurfaceUnpinnedAdminAddins.length > 0) {
        // Update getExt store with unpinned admin addins for compose surface
        updateUnpinnedAdminAddins(
            composeSurfaceUnpinnedAdminAddins,
            ExtensibilityModeEnum.MessageCompose
        );
    }

    // Calendar surface
    let calendarOptions: CalendarSurfaceAddinsOptions = await getServerOptionsForFeature<CalendarSurfaceAddinsOptions>(
        OwsOptionsFeatureType.CalendarSurfaceAddins
    );

    const calendarSurfaceUnpinnedAdminAddins = getAdminInstalledUnpinnedAddins(
        allAdminAddins,
        calendarOptions.calendarSurfaceAddins
    );
    if (calendarSurfaceUnpinnedAdminAddins.length > 0) {
        // Update getExt store with unpinned admin addins for calendar surface
        updateUnpinnedAdminAddins(
            calendarSurfaceUnpinnedAdminAddins,
            ExtensibilityModeEnum.AppointmentOrganizer
        );
    }
}

/*
 * Helper function, to find the admin addns which are unpinned for a surface,
 * from the list of pinned add-ins
 * @param adminAddins => All admin installed addins available for that surface
 * @param surfacePinnedAddins => All pinned addins available for that surface
 */
function getAdminInstalledUnpinnedAddins(adminAddins: string[], surfacePinnedAddins): string[] {
    if (!surfacePinnedAddins || surfacePinnedAddins.length == 0) {
        // If nothing is pinned in surface, return the original adminAddins array
        return adminAddins;
    }

    let adminInstalledUnpinnedAddins: string[] = [];

    adminAddins.forEach(addin => {
        if (!surfacePinnedAddins.includes(addin)) {
            // If it is not in the list of pinned addin, we store it
            adminInstalledUnpinnedAddins.push(addin);
        }
    });

    return adminInstalledUnpinnedAddins;
}
