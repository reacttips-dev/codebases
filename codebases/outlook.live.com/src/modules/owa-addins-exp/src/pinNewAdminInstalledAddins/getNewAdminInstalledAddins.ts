import type Extension from 'owa-service/lib/contract/Extension';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    getPreviousAdminInstalledAddins,
    setPreviousAdminInstalledAddins,
    isPreviousAdminAddinsInCache,
} from '../utils/adminAddinsCache';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const HOUR_TIMESPAN_IN_MS = 1000 * 60 * 60 * 24;

// This function finds out new admin installed addins and returns array of
// addinId for same.
//
// @param addins List of addins (Extension) received in GetExtensibilityContext
//               response.
export function getNewAdminInstalledAddins(addins: Extension[]): string[] {
    let currentAdminAddins = getAdminInstalledAddins(addins);

    if (!isPreviousAdminAddinsInCache()) {
        // If we don't have anything in cache yet, this is our first call to
        // GetExtensibilityContext for this experiment. Save the current admins and
        // return the current admins in case the user is a 'new user' i.e mailbox created within 24 hrs.
        // Else just return (no need to do pinning + callout).
        setPreviousAdminInstalledAddins(currentAdminAddins);
        if (isOwaUserNew() || isFeatureEnabled('addin-exp-testPinOldAdminAddins')) {
            return currentAdminAddins;
        } else {
            return [];
        }
    }

    let previousAdminAddins = getPreviousAdminInstalledAddins();

    // Find our newly installed addins.
    let newAddins = currentAdminAddins.filter(key => previousAdminAddins.indexOf(key) < 0);
    setPreviousAdminInstalledAddins(currentAdminAddins);
    return newAddins;
}

// This helper function finds out admin installed addins from given 'addins' list
// and returns array of addinId for the same.
//
// @param addins List of addins (Extension) received in GetExtensibilityContext response.
// @returns Array of addinId (string) of 'admin installed' addins.
export function getAdminInstalledAddins(addins: Extension[]): string[] {
    let addinKeys: string[] = [];

    for (const addin of addins) {
        if (!addin.Enabled) {
            continue;
        }

        if (!addin.ExtensionPointCollection) {
            continue;
        }

        // Admin installed addin.
        if (addin.OriginString === 'Organization') {
            let key = addin.Id.toLowerCase();
            addinKeys.push(key);
        }
    }
    return addinKeys;
}

// This helper function find out if the current's user is a 'new user'
// We consider the user to be a 'new user' if the user's mailbox was created within the last 24 hrs
//
// @returns true if the user is a 'new user'
function isOwaUserNew(): boolean {
    let createDate = new Date(getUserConfiguration().MailboxCreateDate);
    return Date.now() - createDate.getTime() < HOUR_TIMESPAN_IN_MS;
}
