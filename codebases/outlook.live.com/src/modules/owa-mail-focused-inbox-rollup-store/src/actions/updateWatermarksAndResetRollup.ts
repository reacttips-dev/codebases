import focusedInboxRollupStore from '../store/store';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import InboxViewType from 'owa-service/lib/contract/InboxViewType';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ActionSource } from 'owa-mail-store';
import { action, orchestrator, mutator } from 'satcheljs';

const ViewStateConfigName = 'OWA.ViewStateConfiguration';

/**
 * Update last visit timestamps for selected view and reset rollup data
 */
const updateWatermarksAndResetRollup = action(
    'updateWatermarksAndResetRollup',
    (focusedViewFilterToSelect: FocusedViewFilter, actionSource: ActionSource) =>
        addDatapointConfig(
            {
                name: 'TnS_ResetFocusedOtherRollup',
                customData: [actionSource, focusedViewFilterToSelect],
            },
            { focusedViewFilterToSelect }
        )
);

/**
 * Update folder view watermark for focused/other folders
 */
orchestrator(updateWatermarksAndResetRollup, actionMessage => {
    const currentTime = new Date(Date.now()).toUTCString();

    updateUserConfigurationAndService(
        config => {
            config.ViewStateConfiguration.FocusedViewWatermark = currentTime;
            config.ViewStateConfiguration.ClutterViewWatermark = currentTime;
        },
        [
            { key: 'FocusedViewWatermark', valuetype: 'String', value: [currentTime] },
            { key: 'ClutterViewWatermark', valuetype: 'String', value: [currentTime] },
        ],
        ViewStateConfigName
    );
});

/**
 * Reset rollup data in store
 */
mutator(updateWatermarksAndResetRollup, () => {
    focusedInboxRollupStore.uniqueSenders = null;
    focusedInboxRollupStore.unseenCountToDisplay = null;
    focusedInboxRollupStore.viewType = InboxViewType.Invalid;
});

export default updateWatermarksAndResetRollup;
