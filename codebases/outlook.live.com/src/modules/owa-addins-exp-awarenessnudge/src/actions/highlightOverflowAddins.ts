import getExtensibilityState from 'owa-addins-store/lib/store/getExtensibilityState';
import { SurfaceActionItem } from 'owa-surface-actions';
import { logAppHighlightedTelemetry } from 'owa-addins-analytics';
import { ExtensibilityModeEnum } from 'owa-addins-types';

/*  This function receives the overflow addins, which are of SurfaceActionItem type
    And changes their className based on theme being used
*/

export default function customizeOverflowItems(surfaceActionItem: SurfaceActionItem) {
    const fetchGetExtensibilityState = getExtensibilityState();
    if (!fetchGetExtensibilityState.shouldHighlightUnpinnedAdminAddins) {
        return;
    }

    if (fetchGetExtensibilityState.mailReadSurfaceUnpinnedAdminAddins) {
        fetchGetExtensibilityState.mailReadSurfaceUnpinnedAdminAddins?.forEach(item => {
            if (item == surfaceActionItem.key) {
                surfaceActionItem.className =
                    fetchGetExtensibilityState.themeSpecificHighlightDataStore;
                // Log 'AppHighlighted' telemetry event for addins highlighted.
                logAppHighlightedTelemetry(
                    surfaceActionItem.key,
                    ExtensibilityModeEnum.MessageRead
                );
            }
        });
    }

    if (fetchGetExtensibilityState.mailComposeSurfaceUnpinnedAdminAddins) {
        fetchGetExtensibilityState.mailComposeSurfaceUnpinnedAdminAddins?.forEach(item => {
            if (item == surfaceActionItem.key) {
                surfaceActionItem.className =
                    fetchGetExtensibilityState.themeSpecificHighlightDataStore;
                // Log 'AppHighlighted' telemetry event for addins highlighted.
                logAppHighlightedTelemetry(
                    surfaceActionItem.key,
                    ExtensibilityModeEnum.MessageCompose
                );
            }
        });
    }

    if (fetchGetExtensibilityState.calendarSurfaceUnpinnedAdminAddins) {
        fetchGetExtensibilityState.calendarSurfaceUnpinnedAdminAddins?.forEach(item => {
            if (item == surfaceActionItem.key) {
                surfaceActionItem.className =
                    fetchGetExtensibilityState.themeSpecificHighlightDataStore;
                // Log 'AppHighlighted' telemetry event for addins highlighted.
                logAppHighlightedTelemetry(
                    surfaceActionItem.key,
                    ExtensibilityModeEnum.AppointmentOrganizer
                );
            }
        });
    }
}
