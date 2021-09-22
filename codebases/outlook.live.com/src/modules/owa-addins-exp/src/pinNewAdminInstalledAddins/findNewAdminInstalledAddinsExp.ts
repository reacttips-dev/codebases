import type Extension from 'owa-service/lib/contract/Extension';
import { getNewAdminInstalledAddins } from './getNewAdminInstalledAddins';
import { updateAnyNewAdminAddinInstalled } from 'owa-addins-store';
import { logAppInstallTelemetry } from 'owa-addins-analytics';

// This function finds out newly installed admin addins
// and returns array of addin Ids of these new addins.
//
// Control: Find newly installed admin addins
//
// @param addins List of addins (Extension) received in GetExtensibilityContext response.
export function findNewAdminInstalledAddinsExp(addins: Extension[]): string[] {
    // Control: Detect newly installed admin addins
    let newAdminInstalledAddins: string[] = getNewAdminInstalledAddins(addins);

    if (newAdminInstalledAddins.length <= 0) {
        // No new Admin installed addins found.
        return [];
    }

    updateAnyNewAdminAddinInstalled(true);

    // Log 'AppInstall' telemetry event for newly installed admin addin.
    for (const addinId of newAdminInstalledAddins) {
        logAppInstallTelemetry(addinId);
    }

    return newAdminInstalledAddins;
}
