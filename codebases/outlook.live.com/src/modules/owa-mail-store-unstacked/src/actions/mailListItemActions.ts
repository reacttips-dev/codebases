import { action } from 'satcheljs';
import type { ConversationFork } from 'owa-graph-schema';

/**
 * Unstacked reading pane - Expand first level in mailList for conversation with multiple forks
 * @param rowKey the rowKey of the item that selection changed on
 * @param forks the forks in a conversation
 */
export const expandRowFirstLevel = action(
    'EXPAND_ROW_FIRST_LEVEL',
    (rowKey: string, forks: ConversationFork[]) => ({
        rowKey,
        forks,
    })
);

export const removeForksStoreUpdate = action(
    'REMOVE_FORKS_STORE_UPDATE',
    (forks: ConversationFork[], itemIdsToRemove: string[]) => ({
        forks,
        itemIdsToRemove,
    })
);
