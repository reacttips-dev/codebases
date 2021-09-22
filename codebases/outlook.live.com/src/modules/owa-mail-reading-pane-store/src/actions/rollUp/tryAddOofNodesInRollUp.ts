import type ItemPartViewState from '../../store/schema/ItemPartViewState';
import { getParentItemPart } from '../../utils/rollUp/rollUpUtils';
import type { ObservableMap } from 'mobx';
import type { ConversationReadingPaneNode } from 'owa-mail-store';
import { action } from 'satcheljs/lib/legacy';

export default action('tryAddOofNodesInRollUp')(function tryAddOofNodesInRollUp(
    itemPartsMap: ObservableMap<string, ItemPartViewState>,
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>,
    conversationNodeIds: string[],
    shouldCleanUpChildrenNodes: boolean
) {
    // If it's update scenario, we need to clean up the children nodes and build it again.
    // If not, we could not confirm the children nodes sequence in update scenario.
    if (shouldCleanUpChildrenNodes) {
        itemPartsMap.forEach(itemPartViewState => {
            itemPartViewState.oofRollUpViewState.oofReplyNodeIds = [];
        });
    }

    conversationNodeIds.forEach(nodeId => {
        const itemPartViewState = itemPartsMap.get(nodeId);
        if (!itemPartViewState || !itemPartViewState.oofRollUpViewState.isOofItem) {
            return;
        }

        // Reset isInRollUp to false in case that the parent node is deleted.
        itemPartViewState.isInRollUp = false;

        // Try to find the parent node
        const parentItemPart = getParentItemPart(nodeId, itemPartsMap, conversationNodes);

        // If parent item is already in roll up(for exmpale, parent item is a meeting response message
        // in calendar roll up), don't add this item part in roll up.
        if (parentItemPart && !parentItemPart.isInRollUp) {
            itemPartViewState.isInRollUp = true;
            parentItemPart.oofRollUpViewState.oofReplyNodeIds.push(nodeId);
        }
    });
});
