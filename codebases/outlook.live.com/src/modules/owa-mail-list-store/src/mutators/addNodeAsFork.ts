import { isFirstLevelExpanded } from '../selectors/isConversationExpanded';
import listViewStore from '../store/Store';
import { mutatorAction } from 'satcheljs';
import type { ConversationFork } from 'owa-graph-schema';

export const addNodeAsFork = mutatorAction('addNodeAsFork', (rowKey: string, nodeId: string) => {
    if (isFirstLevelExpanded(rowKey) && nodeId) {
        const forks: ConversationFork[] = listViewStore.expandedConversationViewState.forks;
        const forkIds = forks.map(fork => fork.id);
        // If the node doesn't already exist, add it to the forks
        // TODO: rationalize if node ids are in different formats EWS vs immutableId
        if (forkIds.indexOf(nodeId) == -1) {
            forks.unshift({
                id: nodeId,
                displayNames: [], // TODO replace with display names
                forkId: '', // TODO replace with forkId obtained from hx fork
                ancestorIds: [], // TODO replace with ancestor ids
            });
        }
    }
});
