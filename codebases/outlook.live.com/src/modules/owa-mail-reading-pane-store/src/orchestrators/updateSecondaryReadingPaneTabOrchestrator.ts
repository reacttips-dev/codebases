import findSecondaryReadingPaneTabById from '../utils/findSecondaryReadingPaneTabById';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { AsyncSendState, ComposeLifecycleEvent } from 'owa-mail-compose-store';
import { getTabHandler } from 'owa-tab-store/lib/utils/TabHandler';
import conversationSendStateChanged from 'owa-mail-compose-actions/lib/actions/conversationSendStateChanged';
import { isSxSDisplayed } from 'owa-sxs-store';
import { lazyActivateTab, lazyCloseTab, lazySetTabIsShown } from 'owa-tab-store';
import { orchestrator } from 'satcheljs';

export default orchestrator(conversationSendStateChanged, actionMessage => {
    const { viewState } = actionMessage;
    const tab = viewState && findSecondaryReadingPaneTabById(viewState.conversationId);
    if (!viewState.isInlineCompose || isSxSDisplayed(tab?.sxsId)) {
        return;
    }

    if (tab) {
        switch (viewState.asyncSendState) {
            case AsyncSendState.None:
                lazySetTabIsShown.importAndExecute(tab, true /* isShown */);
                lazyActivateTab.importAndExecute(tab);
                break;

            case AsyncSendState.Delay:
                lazySetTabIsShown.importAndExecute(tab, false /* isShown */);
                break;

            default:
                // Sending, Sent, Closed, Timeout, Error
                lazyCloseTab.importAndExecute(tab);
                break;
        }
    }
});

orchestrator(onComposeLifecycleEvent, actionMessage => {
    const { viewState, event } = actionMessage;

    if (event == ComposeLifecycleEvent.Discard && viewState.isInlineCompose) {
        const tab = findSecondaryReadingPaneTabById(viewState.conversationId);
        const handler = getTabHandler(tab?.type);

        // If there is a related reading pane tab which is not shown due to same selection with primary tab,
        // we can close it now to avoid it being shown later when user switch list view selection
        if (handler?.canShowTab && !handler.canShowTab(tab)) {
            lazyCloseTab.importAndExecute(tab);
        }
    }
});
