import getExtensibilityState from 'owa-addins-store/lib/store/getExtensibilityState';
import { SurfaceActionItem } from 'owa-surface-actions';
import { FilterableMenuItem } from 'owa-filterable-menu';
import { logCustomizeActionButtonAction } from 'owa-addins-analytics';
import { CustomizeActionStatusEnum, CustomizeActionPlacementEnum } from 'owa-addins-types';
/*  This function receives the overflow addins, which are of SurfaceActionItem
    or FilterableMenuItem type, And changes their className based on theme being used
*/

export default function highlightCustomizeActionButton(
    surfaceActionItem: SurfaceActionItem | FilterableMenuItem
) {
    const fetchGetExtensibilityState = getExtensibilityState();

    if (fetchGetExtensibilityState.shouldHighlightUnpinnedAdminAddins) {
        if (
            fetchGetExtensibilityState.mailReadSurfaceUnpinnedAdminAddins ||
            fetchGetExtensibilityState.mailComposeSurfaceUnpinnedAdminAddins ||
            fetchGetExtensibilityState.calendarSurfaceUnpinnedAdminAddins
        ) {
            surfaceActionItem.className =
                fetchGetExtensibilityState.themeSpecificHighlightDataStore;
            // Log 'CustomizeActionEvents' telemetry event for customize action button actions.
            logCustomizeActionButtonAction(
                CustomizeActionStatusEnum.Highlighted,
                CustomizeActionPlacementEnum.OverFlowMenu
            );
        }
    }
}
