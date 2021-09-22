import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import canConversationLoadMore from 'owa-mail-store/lib/utils/canConversationLoadMore';

/**
 * Check whether all item parts and their OOF rollup components in the conversation are expanded.
 */
export default function isAllItemPartsExpanded(conversationId: string): boolean {
    const viewState = getConversationReadingPaneViewState(conversationId);
    if (!viewState) {
        return false;
    }

    const { itemPartsMap } = viewState;
    // Check whether to expand or collapse the conversation.
    // If there exists an item part that is not expanded, or there exists an item part
    // for which the OOFRollup is not expanded, then isAllItemPartsExpanded is false
    const isSomeItemPartOrOofRollupCollapsed = [...itemPartsMap.values()].some(
        itemPart =>
            !itemPart.isExpanded ||
            (itemPart.oofRollUpViewState.oofReplyNodeIds.length &&
                !itemPart.oofRollUpViewState.isOofRollUpExpanded)
    );
    return !isSomeItemPartOrOofRollupCollapsed && !canConversationLoadMore(conversationId);
}
