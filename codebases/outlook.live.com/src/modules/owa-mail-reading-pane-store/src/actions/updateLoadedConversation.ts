import firstLoadConversationReadingPane from './firstLoadConversationReadingPane';
import updateLoadedConversationReadingPaneAction from './updateLoadedConversationReadingPaneAction';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import isConversationReadingPaneViewStateLoaded from '../utils/isConversationReadingPaneViewStateLoaded';
import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';
import { action } from 'satcheljs/lib/legacy';

export interface UpdateLoadedConversationState {
    loadedConversationState: ConversationReadingPaneViewState;
}

export let UpdateLoadedConversationName = 'updateLoadedConversation';

export default action(UpdateLoadedConversationName)(function updateLoadedConversation(
    changedConversationId: string,
    nodeIdCollectionChanged?: CollectionChange<string>,
    state: UpdateLoadedConversationState = {
        loadedConversationState: getConversationReadingPaneViewState(),
    }
) {
    const loadedConversationId = state.loadedConversationState
        ? state.loadedConversationState.conversationId
        : null;
    // Only update reading pane store if conversation is currently loaded.
    if (loadedConversationId && loadedConversationId.Id == changedConversationId) {
        if (state.loadedConversationState.loadingState.isLoading) {
            firstLoadConversationReadingPane(changedConversationId);
        } else if (nodeIdCollectionChanged) {
            updateLoadedConversationReadingPaneAction(
                loadedConversationId.Id,
                nodeIdCollectionChanged
            );
        }
    } else if (
        nodeIdCollectionChanged &&
        isConversationReadingPaneViewStateLoaded(changedConversationId)
    ) {
        updateLoadedConversationReadingPaneAction(changedConversationId, nodeIdCollectionChanged);
    }
});
