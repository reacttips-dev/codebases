import getPrimaryTabId from './getPrimaryTabId';
import isItemReadingPaneViewStateLoaded from './isItemReadingPaneViewStateLoaded';
import clearReadingPaneStore from '../actions/clearReadingPaneStore';
import loadConversationReadingPane from '../actions/loadConversationReadingPane';
import loadItemReadingPane from '../actions/loadItemReadingPane';
import setItemReadingPaneViewState from '../actions/setItemReadingPaneViewState';
import { releaseLoadedConversationViewState } from '../mutators/loadedConversationViewStateMutators';
import { releaseLoadedItemViewState } from '../mutators/loadedItemViewStateMutators';
import { getStore as getReadingPaneStore } from '../store/Store';
import isConversationReadingPaneViewStateLoaded from '../utils/isConversationReadingPaneViewStateLoaded';
import { lazyPrepareAddinCommunicationInPopout } from 'owa-addins-common-utils';
import { getReadHostItemIndex } from 'owa-addins-core';
import { lazyTrySaveAndCloseCompose } from 'owa-mail-compose-actions';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { getStore as getComposeStore } from 'owa-mail-compose-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import { getReadingPaneRouteForPopoutV2 } from 'owa-popout-v2';
import getDeeplinkUrl from 'owa-popout-v2/lib/utils/getDeeplinkUrl';
import getProjection from 'owa-popout-v2/lib/utils/getProjection';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getOrigin, joinPath } from 'owa-url';
import {
    registerTabHandler,
    TabHandler,
    TabType,
    TabState,
    SecondaryReadingPaneTabViewState,
} from 'owa-tab-store';

const secondaryReadingPaneTabHandler: TabHandler = {
    onActivate: (viewState: SecondaryReadingPaneTabViewState) => {
        const secondaryReadingPaneTabData = viewState.data;

        if (
            (secondaryReadingPaneTabData.listViewType === ReactListViewType.Message ||
                shouldShowUnstackedReadingPane()) &&
            !isItemReadingPaneViewStateLoaded(secondaryReadingPaneTabData.id.Id)
        ) {
            loadItemReadingPane(
                secondaryReadingPaneTabData.id,
                secondaryReadingPaneTabData.instrumentationContext,
                setItemReadingPaneViewState
            );
        } else if (
            secondaryReadingPaneTabData.listViewType === ReactListViewType.Conversation &&
            !isConversationReadingPaneViewStateLoaded(secondaryReadingPaneTabData.id.Id)
        ) {
            loadConversationReadingPane(
                secondaryReadingPaneTabData.id,
                secondaryReadingPaneTabData.instrumentationContext,
                secondaryReadingPaneTabData.subject
            );
        }
    },
    canClose: async (viewState: SecondaryReadingPaneTabViewState) => {
        const secondaryReadingPaneTabData = viewState.data;
        if (
            secondaryReadingPaneTabData.listViewType === ReactListViewType.Message ||
            shouldShowUnstackedReadingPane()
        ) {
            if (secondaryReadingPaneTabData.id.Id != getPrimaryTabId()) {
                releaseLoadedItemViewState(secondaryReadingPaneTabData.id.Id);
            }
            return true;
        } else if (secondaryReadingPaneTabData.listViewType === ReactListViewType.Conversation) {
            try {
                const conversationId = secondaryReadingPaneTabData.id.Id;

                // When this tab is showing the same conversation with primary tab, always allow close
                if (conversationId == getPrimaryTabId()) {
                    return true;
                } else {
                    releaseLoadedConversationViewState(conversationId);
                }

                const composeViewState = findInlineComposeViewState(conversationId);
                if (composeViewState) {
                    await lazyTrySaveAndCloseCompose.importAndExecute(composeViewState);
                    return !findInlineComposeViewState(conversationId);
                }
                return true;
            } catch (e) {
                // In case of any errors in obtaining conversation view state, always allow close
                return true;
            }
        }
        return true;
    },
    canShowTab: (viewState: SecondaryReadingPaneTabViewState) => {
        const readingPaneStore = getReadingPaneStore();
        const composeStore = getComposeStore();
        return (
            viewState.data?.id?.Id != readingPaneStore.primaryReadingPaneTabId?.Id ||
            !viewState.data?.hideWhenSameWithPrimary ||
            !!composeStore.primaryComposeId
        );
    },
    onDeactivate: (viewState: SecondaryReadingPaneTabViewState) => {
        const secondaryReadingPaneTabData = viewState.data;
        // The default ReadingPane render is based on the contents of the store.
        // In scenarios like the drafts folder, switching items renders the default RP content.
        // This is often times whatever item was previously in the store for this value.
        // We null the store's content so that this does not happen.
        clearReadingPaneStore(secondaryReadingPaneTabData.listViewType);
    },
    onPopout: (viewState: SecondaryReadingPaneTabViewState, targetWindow: Window) => {
        lazyPrepareAddinCommunicationInPopout.importAndExecute(
            targetWindow,
            getReadHostItemIndex(viewState.data?.id?.Id)
        );
    },
    onBeforeCloseMainWindow: (viewState: SecondaryReadingPaneTabViewState) => {
        return getReadDeeplinkUrl(viewState);
    },
    reloadAsDeeplink: (
        viewState: SecondaryReadingPaneTabViewState,
        urlParams?: Record<string, string>
    ) => {
        const targetWindow = getProjection(viewState.id)?.window || window;
        if (viewState.state == TabState.Popout && targetWindow) {
            const readDeeplinkUrl = getReadDeeplinkUrl(viewState, urlParams);
            if (readDeeplinkUrl != null) {
                targetWindow.location.href = joinPath(getOrigin(), readDeeplinkUrl);
            }
        }
    },
};

export default function ensureSecondaryReadingPaneTabHandler() {
    registerTabHandler(TabType.SecondaryReadingPane, secondaryReadingPaneTabHandler);
}

function getReadDeeplinkUrl(
    viewState: SecondaryReadingPaneTabViewState,
    urlParams?: Record<string, string>
): string | null {
    const itemId = viewState.data?.id;
    const isMessageView = viewState.data?.listViewType == ReactListViewType.Message;
    return itemId?.Id && isMessageView
        ? getDeeplinkUrl('mail', getReadingPaneRouteForPopoutV2(itemId.mailboxInfo, itemId.Id), {
              isStandalone: true,
              urlParameters: urlParams,
          })
        : null;
}
