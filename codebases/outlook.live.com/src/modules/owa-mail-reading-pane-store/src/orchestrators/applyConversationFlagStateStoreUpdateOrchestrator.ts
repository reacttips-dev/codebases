import type { ObservableMap } from 'mobx';
import { createLazyOrchestrator } from 'owa-bundling';
import applyConversationFlagStateStoreUpdate from 'owa-mail-actions/lib/triage/applyConversationFlagStateStoreUpdate';
import { getStore as getListViewStore } from 'owa-mail-list-store/lib/store/Store';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type Item from 'owa-service/lib/contract/Item';
import { mutatorAction } from 'satcheljs';

function getFlaggableItemsFromConversations(
    conversationIds: string[],
    flagType: FlagType,
    folderId: string,
    conversations: ObservableMap<string, ConversationItemParts>,
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>,
    storeItems: ObservableMap<string, Item>
): Item[] {
    const items = [];

    conversationIds.forEach(conversationId => {
        const itemIds = getFlaggableItemsFromSingleConversation(
            conversationId,
            flagType,
            folderId,
            conversations,
            conversationNodes,
            storeItems
        );

        itemIds.forEach(itemId => items.push(storeItems.get(itemId)));
    });

    return items;
}

function getFlaggableItemsFromSingleConversation(
    conversationId: string,
    flagType: FlagType,
    folderId: string,
    conversations: ObservableMap<string, ConversationItemParts>,
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>,
    storeItems: ObservableMap<string, Item>
): string[] {
    const itemIds = [];
    const flagStatusToApply: FlagStatus = flagType.FlagStatus as FlagStatus;
    const conversationItemParts: ConversationItemParts = conversations.get(conversationId);

    if (conversationItemParts) {
        const isNewestOnBottom =
            conversationItemParts.conversationSortOrder == 'ChronologicalNewestOnBottom';
        const itemPartCount = conversationItemParts.conversationNodeIds.length;
        let itemIndex = isNewestOnBottom ? itemPartCount - 1 : 0;
        const indexIncrement = isNewestOnBottom ? -1 : 1;

        while (itemIndex >= 0 && itemIndex < itemPartCount) {
            const conversationNodeId = conversationItemParts.conversationNodeIds[itemIndex];
            const conversationNode = conversationNodes.get(conversationNodeId);

            for (const itemId of conversationNode.itemIds) {
                const item = storeItems.get(itemId);
                if (
                    item.ConversationId?.Id == conversationId &&
                    item.ParentFolderId?.Id == folderId
                ) {
                    if (flagStatusToApply == 'Flagged') {
                        // if we are flagging , flag only first item in the same local folder as conversation
                        itemIds.push(itemId);
                        return itemIds;
                    } else if (item.Flag && item.Flag.FlagStatus == 'Flagged') {
                        // if we are unflagging, unflag all that are flagged
                        itemIds.push(itemId);
                    }
                }
            }

            itemIndex += indexIncrement;
        }
    }

    return itemIds;
}

const updateFlagStatusOnConversationItems = mutatorAction(
    'updateFlagStatusOnConversationItems',
    (itemsToUpdateFlag: Item[], flagType: FlagType) => {
        for (let i = 0; i < itemsToUpdateFlag.length; i++) {
            itemsToUpdateFlag[i].Flag = flagType;
        }
    }
);

export const applyConversationFlagStateStoreUpdateOrchestrator = createLazyOrchestrator(
    applyConversationFlagStateStoreUpdate,
    'applyConversationFlagStateStoreUpdateClone',
    actionMessage => {
        const { conversationIds, flagType, tableViewId } = actionMessage;
        const tableView = getListViewStore().tableViews.get(tableViewId);
        const mailStore = getMailStore();
        const itemsToUpdateFlag = getFlaggableItemsFromConversations(
            conversationIds,
            flagType,
            tableView.serverFolderId,
            mailStore.conversations,
            mailStore.conversationNodes,
            mailStore.items
        );
        updateFlagStatusOnConversationItems(itemsToUpdateFlag, flagType);
    }
);
