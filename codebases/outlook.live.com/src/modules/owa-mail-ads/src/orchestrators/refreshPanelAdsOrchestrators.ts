import setAppPaneUnderlayVisibility from 'owa-application/lib/actions/setAppPaneUnderlayVisibility';
import { isFeatureEnabled } from 'owa-feature-flags';
import { selectRowInDirection } from 'owa-mail-actions/lib/mailListSelectionActions';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { ComposeLifecycleEvent } from 'owa-mail-compose-store';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import { onMailSearchComplete } from 'owa-mail-actions/lib/mailSearchActions';
import { refresh, disableOrEnableRefresh } from '../adbar/AdBar';
import { selectFocusedViewFilter } from 'owa-mail-triage-table-utils';
import { SelectionDirection } from 'owa-mail-list-store';
import { orchestrator } from 'satcheljs';
import { onSingleMailItemSelected } from 'owa-mail-actions/lib/mailListActions';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import {
    onDeleteConversationItemPartsComplete,
    toggleRowReadStateComplete,
} from 'owa-mail-actions/lib/mailTriageActions';
import { userMailInteractionAction } from 'owa-mail-actions';
import emptyFolderStoreUpdate from 'owa-folder-emptyfolder/lib/actions/emptyFolderStoreUpdate';
import { setShowListPane } from 'owa-mail-layout';

// setTimeout handler for refresh panel ads task
let refreshAdOnTimeoutTask;

/**
 * Orchestrators listening for various actions to refresh panel ad
 */
orchestrator(onSingleMailItemSelected, () => scheduleRefreshTask('onSingleMailItemSelected'));
orchestrator(onSelectFolderComplete, () => scheduleRefreshTask('onSelectFolderComplete'));
orchestrator(onDeleteConversationItemPartsComplete, () =>
    scheduleRefreshTask('onDeleteConversationItemPartsCompleted')
);
orchestrator(toggleRowReadStateComplete, () => scheduleRefreshTask('toggleRowReadStateComplete'));
orchestrator(onMailSearchComplete, () => scheduleRefreshTask('onMailSearchComplete'));
orchestrator(onComposeLifecycleEvent, actionMessage => {
    if (actionMessage.event == ComposeLifecycleEvent.Opened) {
        scheduleRefreshTask('onComposeOpened');
    } else if (actionMessage.event == ComposeLifecycleEvent.Closed) {
        scheduleRefreshTask('onComposeClosed');
    }
});
orchestrator(selectRowInDirection, actionMessage =>
    scheduleRefreshTask(
        actionMessage.selectionDirection === SelectionDirection.Next
            ? 'selectNextRow'
            : 'selectPreviousRow'
    )
);
orchestrator(selectFocusedViewFilter, () => scheduleRefreshTask('selectFocusedViewFilter'));
orchestrator(setSelectionOnRow, () => scheduleRefreshTask('setSelectionOnRow'));
orchestrator(userMailInteractionAction, () => scheduleRefreshTask('userMailInteractionAction'));
orchestrator(setAppPaneUnderlayVisibility, actionMessage => {
    if (!actionMessage.isShown) {
        disableOrEnableRefresh();
        scheduleRefreshTask('setAppPaneUnderlayVisibility');
    } else {
        disableOrEnableRefresh(actionMessage.key + '.hideAd');
    }
});
orchestrator(emptyFolderStoreUpdate, () => scheduleRefreshTask('emptyFolderWithoutConfirmation'));
orchestrator(setShowListPane, () => scheduleRefreshTask('setShowListPane'));

/**
 * Refresh ad scheduler called from all orchestrators
 * @param sourceActionName the name of the source action
 */
function scheduleRefreshTask(sourceActionName: string) {
    if (refreshAdOnTimeoutTask) {
        // No-op, if there is pending refreshAd task
        return;
    }

    // We want to delay refreshing of the panel ad so that it does not interfere in the
    // synchronous execution of the action requesting the refresh of the ad
    refreshAdOnTimeoutTask = setTimeout(() => {
        refreshAdsInternal(sourceActionName);
    }, 0);
}

/**
 * Makes a call to refresh the panel ad
 * @param sourceActionName the source action
 */
function refreshAdsInternal(sourceActionName: string) {
    // Only import refreshAd when the user is under the Ads flight, otherwise, the adspanel js will be downloaded to the enterprise account.
    if (isFeatureEnabled('fwk-ads')) {
        refresh(sourceActionName);
        refreshAdOnTimeoutTask = null;
    }
}
