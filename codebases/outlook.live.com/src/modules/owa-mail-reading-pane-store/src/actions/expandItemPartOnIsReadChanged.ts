import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { action } from 'satcheljs/lib/legacy';

export interface ExpandItemPartOnIsReadChangedState {
    loadedConversationState: ConversationReadingPaneViewState;
}

export let ExpandItemPartOnIsReadChangedName = 'expandItemPartOnIsReadChanged';

export default action(ExpandItemPartOnIsReadChangedName)(function expandItemPartOnIsReadChanged(
    changedConversationId: string,
    nodeIds: string[],
    state: ExpandItemPartOnIsReadChangedState = {
        loadedConversationState: getConversationReadingPaneViewState(),
    }
) {
    const loadedConversationId = state.loadedConversationState
        ? state.loadedConversationState.conversationId
        : null;
    // Only update reading pane store if conversation is currently loaded.
    if (loadedConversationId && loadedConversationId.Id == changedConversationId) {
        nodeIds.forEach(nodeId => {
            const itemPartViewState = state.loadedConversationState.itemPartsMap.get(nodeId);
            if (itemPartViewState?.isLocal) {
                itemPartViewState.isExpanded = true;
            }
        });
    }
});
