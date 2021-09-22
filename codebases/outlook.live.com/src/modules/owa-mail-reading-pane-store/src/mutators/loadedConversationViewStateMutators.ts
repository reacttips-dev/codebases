import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { getStore } from '../store/Store';
import { mutatorAction } from 'satcheljs';
import { secondaryTabsHaveId } from 'owa-tab-store';
import getPrimaryTabId from '../utils/getPrimaryTabId';

export const addLoadedConversationReadingPaneViewState = mutatorAction(
    'addLoadedConversationReadingPaneViewState',
    function (conversationReadingPaneViewState: ConversationReadingPaneViewState) {
        const conversationId = conversationReadingPaneViewState.conversationId.Id;
        const { loadedConversationReadingPaneViewStates } = getStore();
        if (!loadedConversationReadingPaneViewStates.has(conversationId)) {
            loadedConversationReadingPaneViewStates.set(
                conversationId,
                conversationReadingPaneViewState
            );
        }
    }
);

export const releaseOrphanedLoadedConversationViewStates = mutatorAction(
    'releaseOrphanedLoadedConversationViewStates',
    function () {
        const { loadedConversationReadingPaneViewStates } = getStore();
        // Release any view states that do not belong to any tabs
        loadedConversationReadingPaneViewStates.forEach((viewState, loadedConversationId) => {
            if (
                !secondaryTabsHaveId(loadedConversationId) &&
                loadedConversationId != getPrimaryTabId()
            ) {
                loadedConversationReadingPaneViewStates.delete(loadedConversationId);
            }
        });
    }
);

export const releaseLoadedConversationViewState = mutatorAction(
    'releaseLoadedConversationViewState',
    function (conversationId: string) {
        getStore().loadedConversationReadingPaneViewStates.delete(conversationId);
    }
);
