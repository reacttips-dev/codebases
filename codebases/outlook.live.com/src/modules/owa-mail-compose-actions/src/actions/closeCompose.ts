import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import setShouldUpdateContentOnDispose from 'owa-editor/lib/actions/setShouldUpdateContentOnDispose';
import { cleanUpSaveActionManager } from '../actions/trySaveMessage';
import { removeComposeIdFromActedOnMostRecentAttachmentList } from '../orchestrators/onRecipientsInComposeChange';
import { getComposeHostItemIndex, lazyOnComposeClose } from 'owa-addins-core';
import { CloseComposeActionName } from 'owa-mail-compose-action-names';
import { ComposeViewState, getStore, ComposeLifecycleEvent } from 'owa-mail-compose-store';
import { lazyCloseComposeInSxS } from 'owa-sxs-store';
import { findTabByData, lazyCloseTab } from 'owa-tab-store';
import { action } from 'satcheljs/lib/legacy';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { onCloseCompose } from 'owa-mail-actions/lib/composeActions';
import { lazyClearCachedAttachmentSuggestions } from 'owa-attachment-suggestions';
import clearObjectUrls from 'owa-editor-inlineimage-plugin/lib/actions/clearObjectUrls';

function onCloseComposeInReadingPane(viewState: ComposeViewState) {
    if (viewState.isInlineCompose) {
        onComposeLifecycleEvent(viewState, ComposeLifecycleEvent.CloseInlineCompose);
    }
}

async function closeComposeInSxS(viewState: ComposeViewState) {
    (await lazyCloseComposeInSxS.import())(viewState);
}

export type CloseComposeReason =
    | 'Send'
    | 'Discard'
    | 'PoppedOut'
    | 'SavePublicFolder'
    | 'SaveAndClose';

export default action(CloseComposeActionName)(function closeCompose(
    viewState: ComposeViewState,
    closeReason?: CloseComposeReason
): Promise<void> {
    cleanUpSaveActionManager(viewState);
    removeInfoBarMessage(viewState);
    setShouldUpdateContentOnDispose(viewState, false /*shouldUpdateContentOnDispose*/);
    clearObjectUrls(viewState.inlineImageV2);
    viewState.undoSnapshot = undefined;

    const store = getStore();
    const composeId = viewState.composeId;
    const promises: Promise<void>[] = [];

    removeComposeIdFromActedOnMostRecentAttachmentList(composeId);

    if (store.primaryComposeId == composeId) {
        onCloseComposeInReadingPane(viewState);

        if (!viewState.isInlineCompose) {
            onComposeLifecycleEvent(
                viewState,
                ComposeLifecycleEvent.CloseFullComposeFromPrimaryTab
            );
        }

        store.primaryComposeId = null;
    } else {
        const tab = findTabByData(composeId);
        if (tab) {
            onCloseComposeInReadingPane(viewState);
            promises.push(lazyCloseTab.importAndExecute(tab, true /*forceClose*/));
        }

        promises.push(closeComposeInSxS(viewState));
    }

    lazyOnComposeClose.import().then(onComposeClose => {
        onComposeClose(getComposeHostItemIndex(viewState.composeId));
    });

    lazyClearCachedAttachmentSuggestions.import().then(clearCachedAttachmentSuggestions => {
        clearCachedAttachmentSuggestions(viewState.referenceItemId?.Id, composeId);
    });

    return Promise.all(promises).then(() => {
        onComposeLifecycleEvent(viewState, ComposeLifecycleEvent.Closed);
        store.viewStates.delete(composeId);
        onCloseCompose(closeReason);
    });
});
