import initializeAttachmentsForConversationWell from './initializeAttachmentsForConversationWell';
import initializeExtendedCardForConversationReadingPane from './initializeExtendedCardForConversationReadingPane';
import initializeExtendedStateForItemViewState from './initializeExtendedStateForItemViewState';
import tryAddOofNodesInRollUp from './rollUp/tryAddOofNodesInRollUp';
import tryInitializeShouldShowCLPLabel from './tryInitializeShouldShowCLPLabel';
import { createItemPartViewState } from '../actions/loadConversationReadingPane';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import logReParentingEventDatapoint from '../utils/logReparentingEventDatapoint';
import { isItemPartInCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';
import type { ObservableMap } from 'mobx';
import type { ClientItemId } from 'owa-client-ids';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import type { ConversationItemParts } from 'owa-mail-store';
import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import { LocalLieState } from 'owa-mail-store/lib/store/schema/LocalLieState';
import mailStore from 'owa-mail-store/lib/store/Store';
import { action } from 'satcheljs/lib/legacy';
import {
    findItemToLoad,
    shouldCreateItemPartViewState,
} from 'owa-mail-store/lib/utils/conversationsUtils';

/**
 * Because we show a subset of nodes from ConversationItemParts based on folder/inline compose status,
 * we need to check if any modified nodes don't exist in current view state.
 * If so, move the modified node to added nodes.
 */
function adjustNodeIdCollectionChanged(
    nodeIdCollectionChanged: CollectionChange<string>,
    itemPartsMap: ObservableMap<string, ItemPartViewState>
) {
    for (let index = 0; index < nodeIdCollectionChanged.modified.length; index++) {
        const modifiedNodeId = nodeIdCollectionChanged.modified[index];
        if (!itemPartsMap.has(modifiedNodeId)) {
            nodeIdCollectionChanged.modified.splice(index, 1);
            nodeIdCollectionChanged.added.push(modifiedNodeId);
            index--;
        }
    }
}

function preActionsBeforeRemoveNode(
    nodeId: string,
    loadedConversationReadingPaneState: ConversationReadingPaneViewState
) {
    const itemPartViewState = loadedConversationReadingPaneState.itemPartsMap.get(nodeId);

    // Remove the node from collapsed items roll up if the removed item is in the collapsed items roll up
    if (isItemPartInCollapsedItemsRollUp(loadedConversationReadingPaneState, itemPartViewState)) {
        const { conversationNodeIdsInCollapsedItemsRollUp } = loadedConversationReadingPaneState;
        const index = conversationNodeIdsInCollapsedItemsRollUp.indexOf(nodeId);
        conversationNodeIdsInCollapsedItemsRollUp.splice(index, 1);
    }
}

function setLocallieSelectedState(
    state: UpdateLoadedConversationReadingPaneState,
    nodeId: string,
    itemPartViewState: ItemPartViewState
) {
    const conversationNode = state.conversationNodes.get(nodeId);
    if (conversationNode?.localLieState == LocalLieState.Pending) {
        // Select pending local lie node to avoid local lie scroll of out view after send (VSO#41999)
        state.loadedConversationReadingPaneState.focusedItemPart = {
            itemPart: itemPartViewState,
            focusedItemArea: FocusedItemArea.Item,
        };
    }
}

export interface UpdateLoadedConversationReadingPaneState {
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    loadedConversation: ConversationItemParts;
    loadedConversationReadingPaneState: ConversationReadingPaneViewState;
}

export default action('updateLoadedConversationReadingPane')(
    function updateLoadedConversationReadingPane(
        loadedConversationId: string,
        nodeIdCollectionChanged: CollectionChange<string>,
        state: UpdateLoadedConversationReadingPaneState = {
            conversationNodes: mailStore.conversationNodes,
            loadedConversationReadingPaneState: getConversationReadingPaneViewState(
                loadedConversationId
            ),
            loadedConversation: mailStore.conversations.get(loadedConversationId),
        }
    ) {
        logReParentingEventDatapoint(nodeIdCollectionChanged.added, loadedConversationId);
        adjustNodeIdCollectionChanged(
            nodeIdCollectionChanged,
            state.loadedConversationReadingPaneState.itemPartsMap
        );
        const mailboxInfo = state.loadedConversationReadingPaneState.conversationId.mailboxInfo;
        // This is the case where new nodes are added.
        // Create and add corresponding item part view states.
        nodeIdCollectionChanged.added.forEach(addedNodeId => {
            const clientItemId: ClientItemId = {
                mailboxInfo: mailboxInfo,
                Id: addedNodeId,
            };
            let itemPartViewState = createItemPartViewState(clientItemId)[0];
            if (itemPartViewState) {
                state.loadedConversationReadingPaneState.itemPartsMap.set(
                    addedNodeId,
                    itemPartViewState
                );
                // Get the reference from the store (http://aka.ms/mobx4)
                itemPartViewState = state.loadedConversationReadingPaneState.itemPartsMap.get(
                    addedNodeId
                );
                if (itemPartViewState.isExpanded) {
                    // If the new view state is expanded, initialize its extended state
                    initializeExtendedStateForItemViewState(itemPartViewState);
                }
                setLocallieSelectedState(state, addedNodeId, itemPartViewState);
            }
        });
        // This is the case where old nodes are removed.
        // Remove corresponding item part view states.
        nodeIdCollectionChanged.removed.forEach(removedNodeId => {
            preActionsBeforeRemoveNode(removedNodeId, state.loadedConversationReadingPaneState);
            state.loadedConversationReadingPaneState.itemPartsMap.delete(removedNodeId);
        });
        // This is the case where old nodes are modified.
        // We need to re-find item to load and update item part view state accordingly.
        nodeIdCollectionChanged.modified.forEach(modifiedNodeId => {
            const conversationNode = state.conversationNodes.get(modifiedNodeId);
            const [item, isLocal, isDeleted] = findItemToLoad(conversationNode);
            const itemPartViewState = state.loadedConversationReadingPaneState.itemPartsMap.get(
                modifiedNodeId
            );
            if (!shouldCreateItemPartViewState(item, isDeleted, isLocal)) {
                preActionsBeforeRemoveNode(
                    modifiedNodeId,
                    state.loadedConversationReadingPaneState
                );
                state.loadedConversationReadingPaneState.itemPartsMap.delete(modifiedNodeId);
            } else {
                if (itemPartViewState) {
                    itemPartViewState.itemId = item.ItemId.Id;
                    itemPartViewState.isLocal = isLocal;
                    itemPartViewState.isDeleted = isDeleted;
                    if (itemPartViewState.isExpanded) {
                        // If the view state is expanded, reinitialize its extended state
                        initializeExtendedStateForItemViewState(
                            itemPartViewState,
                            true /* reinitializeAttachments */
                        );
                    }
                    if (conversationNode.localLieState == LocalLieState.Complete) {
                        // If this is completed local lie node, mark the node as no longer a local lie node.
                        conversationNode.localLieState = LocalLieState.None;
                    }
                    setLocallieSelectedState(state, modifiedNodeId, itemPartViewState);
                }
            }
        });
        tryAddOofNodesInRollUp(
            state.loadedConversationReadingPaneState.itemPartsMap,
            state.conversationNodes,
            state.loadedConversation.conversationNodeIds,
            true /*shouldCleanUpChildrenNodes*/
        );
        initializeAttachmentsForConversationWell(state.loadedConversationReadingPaneState);
        initializeExtendedCardForConversationReadingPane(
            state.loadedConversationReadingPaneState,
            null /*loadedConversationItemParts*/
        );
        isCLPEnabled() && tryInitializeShouldShowCLPLabel(state.loadedConversationReadingPaneState);
        state.loadedConversationReadingPaneState.loadingState.isLoading = false;
    }
);
