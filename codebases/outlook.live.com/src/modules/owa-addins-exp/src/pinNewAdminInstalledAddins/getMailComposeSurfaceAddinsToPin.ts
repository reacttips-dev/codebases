import type Extension from 'owa-service/lib/contract/Extension';
import {
    ExtensibilityModeEnum,
    AddinTeachingUICalloutGoalEnum,
    AddinTeachingUICalloutActionEnum,
} from 'owa-addins-types';
import { getExtensionPoint, updateMailComposeSurfaceNewAddin } from 'owa-addins-store';
import { logAppTeachingUICalloutTelemetry } from 'owa-addins-analytics';

export function getMailComposeSurfaceAddinsToPin(
    addins: Extension[],
    newAdminInstalledAddins: string[],
    composeSurfacePinnedAddins: string[]
): string[] {
    if (composeSurfacePinnedAddins.length >= 3) {
        // User already has 3 or more addins pinned. We cannot pin more.
        return [];
    }

    // Filter MailCompose surface addins from newAdminInstalledAddins.
    let totalAddinsPinned: number = composeSurfacePinnedAddins.length;
    let mailComposeSurfaceAddinToPin: string[] = [];

    // Add admin addin keys in 'surfaceAddinKeys' until count reaches 3.
    // Also, find out latest addin which we added in surfaceAddinKeys.
    let latestAddinKey: string;

    for (const addinKey of newAdminInstalledAddins) {
        const addinKeyLowerCase = addinKey.toLowerCase();

        if (totalAddinsPinned >= 3) {
            break;
        }

        if (composeSurfacePinnedAddins.includes(addinKeyLowerCase)) {
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

            let extensionPoint = getExtensionPoint(
                addin.ExtensionPointCollection,
                ExtensibilityModeEnum.MessageCompose
            );
            if (!extensionPoint) {
                continue;
            }

            // Found required addin. Add it to list of addins to pin.
            mailComposeSurfaceAddinToPin.push(addinKeyLowerCase);
            ++totalAddinsPinned;

            if (!latestAddinKey) {
                latestAddinKey = addinKeyLowerCase;
            } else {
                // Not selecting this addin for showing Teaching UI Callout.
                logAppTeachingUICalloutTelemetry(
                    addinKey,
                    AddinTeachingUICalloutGoalEnum.NewAdminDeployment,
                    AddinTeachingUICalloutActionEnum.MissNotSelected,
                    ExtensibilityModeEnum.MessageCompose
                );
            }

            // Pick next addin from newAdminInstalledAddins.
            break;
        }
    }

    // Save latest admin addin installed addinId (key) in ExtensibilityState.
    updateMailComposeSurfaceNewAddin(latestAddinKey);

    return mailComposeSurfaceAddinToPin;
}
