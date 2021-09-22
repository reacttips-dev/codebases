import loadAllConversationItemParts from './loadAllConversationItemParts';
import type {
    default as ParentChildRelation,
    ParentChildRelationMap,
} from '../schema/ParentChildRelation';
import { ConversationReadingPaneNode, mailStore } from 'owa-mail-store';
import { OOF_ITEM_CLASS_REGEX } from 'owa-mail-store/lib/utils/constants';

let relationMap: ParentChildRelationMap;
let currentLoadedConversationId: string;

export function getConversationRelationMap(): ParentChildRelationMap {
    return relationMap;
}

/*
 * The current implementation is based on the assumption that we always have root node
 * available from GCI calls.
 */
export async function getConversationItemsRelationMap(
    conversationId: string
): Promise<ParentChildRelationMap | null> {
    if (currentLoadedConversationId != conversationId) {
        currentLoadedConversationId = conversationId;
        await loadAllConversationItemParts(conversationId);

        const conversation = mailStore.conversations?.get(conversationId);

        if (!conversation) {
            return null;
        }

        const allConversationNodeIds: string[] | undefined = conversation?.conversationNodeIds;
        const conversationNodeIdCount = allConversationNodeIds?.length;
        if (!allConversationNodeIds || !conversationNodeIdCount || conversationNodeIdCount == 0) {
            return null;
        }
        const clonedConversationNodeIds = [...allConversationNodeIds];

        const isNewestOnBottom: boolean =
            conversation.conversationSortOrder === 'ChronologicalNewestOnBottom';

        // if sort order is newest on top, reverse the nodes in cloneConversationNodeIds to get
        // root node first and then child nodes in the order of messages sent.
        if (!isNewestOnBottom) {
            clonedConversationNodeIds.reverse();
        }
        const rootNode: ConversationReadingPaneNode | undefined = mailStore.conversationNodes.get(
            clonedConversationNodeIds[0]
        );
        // initialize map with root node
        const conversationItemsRelationMap: Map<string, ParentChildRelation> = new Map();
        if (rootNode) {
            conversationItemsRelationMap.set(rootNode.internetMessageId, {
                itemIds: rootNode.itemIds,
                childrenImIds: [],
            });
        }

        let index = 1; // skip root node
        while (index < conversationNodeIdCount) {
            const node: ConversationReadingPaneNode | undefined = mailStore.conversationNodes.get(
                clonedConversationNodeIds[index]
            );
            updateConversationRelationMapWithNode(conversationItemsRelationMap, node);
            index += 1;
        }

        relationMap = conversationItemsRelationMap;
    }

    return relationMap;
}

/**
 * Helper function to add nodes to the map and update parent child relationships
 */
function updateConversationRelationMapWithNode(
    conversationItemsRelationMap: Map<string, ParentChildRelation>,
    node: ConversationReadingPaneNode | undefined
): void {
    if (!node || !conversationItemsRelationMap) {
        return;
    }

    const internetMessageId = node.internetMessageId;
    const parentInternetMessageId = node.parentInternetMessageId;

    const item = mailStore.items.get(node.itemIds[0]);
    const itemClass = item?.ItemClass;
    const isOofItem = itemClass ? OOF_ITEM_CLASS_REGEX.test(itemClass) : false;
    // OOF item is a standalone node and should not form part of conversation tree.
    if (!isOofItem && parentInternetMessageId) {
        const parentRelation = conversationItemsRelationMap.get(parentInternetMessageId);
        if (parentRelation) {
            parentRelation.childrenImIds.push(internetMessageId);
        }
    }

    conversationItemsRelationMap.set(internetMessageId, {
        itemIds: node.itemIds,
        parentImId: isOofItem ? undefined : parentInternetMessageId,
        childrenImIds: [],
    });
}
