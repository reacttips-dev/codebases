import { expandRowFirstLevel, removeForksStoreUpdate } from '../actions/mailListItemActions';
import { listViewStore } from 'owa-mail-list-store';
import resetExpansionViewStateInternal from 'owa-mail-list-store/lib/utils/resetExpansionViewStateInternal';
import { mutator } from 'satcheljs';

mutator(expandRowFirstLevel, actionMessage => {
    resetExpansionViewStateInternal();
    const expansionState = listViewStore.expandedConversationViewState;
    expansionState.forks = actionMessage.forks;
    expansionState.expandedRowKey = actionMessage.rowKey;
});

mutator(removeForksStoreUpdate, actionMessage => {
    // Locally remove the forks with the matching itemIds
    const { itemIdsToRemove, forks } = actionMessage;
    if (forks) {
        const forkIds = forks.map(fork => fork.id);
        for (const itemIdToRemove of itemIdsToRemove) {
            const indexOfRemovedItem = forkIds.indexOf(itemIdToRemove);
            forkIds.splice(indexOfRemovedItem, 1);
            forks.splice(indexOfRemovedItem, 1);
        }

        // Set the new collection forks on the expandedConversationViewState
        listViewStore.expandedConversationViewState.forks = [...forks];
    }
});
