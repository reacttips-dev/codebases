import type ItemPartViewState from '../../store/schema/ItemPartViewState';
import type { ConversationReadingPaneNode } from 'owa-mail-store';
import type { ObservableMap } from 'mobx';

/**
 * Try to get the parent item part of nodeId
 */
export function getParentItemPart(
    nodeId: string,
    itemPartsMap: ObservableMap<string, ItemPartViewState>,
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>
): ItemPartViewState {
    const node = conversationNodes.get(nodeId);
    return node ? itemPartsMap.get(node.parentInternetMessageId) : null;
}
