import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import reloadReadingPane from 'owa-mail-reading-pane-store/lib/actions/reloadReadingPane';
import onConversationOptionSaved from 'owa-options-actions/lib/onConversationOptionSaved';
import { orchestrator } from 'satcheljs';
import { getStore as getListViewStore } from 'owa-mail-list-store';

/**
 * Called when the user option's conversation option is saved
 */
export default orchestrator(onConversationOptionSaved, actionMessage => {
    reloadReadingPane();

    // Reset the bus stop state because the conversation sort order has been changed
    if (getListViewStore().expandedConversationViewState.selectedNodeIds.length === 1) {
        mailListSelectionActionsV2.resetBusStopStateMap();
    }
});
