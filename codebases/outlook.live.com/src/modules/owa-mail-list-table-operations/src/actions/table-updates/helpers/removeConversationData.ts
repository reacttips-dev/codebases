import { lazyRemoveAttachmentPreviews } from 'owa-mail-attachment-previews';
import { lazyRemoveCouponFromStore } from 'owa-mail-coupon-peek';
import type { ObservableMap } from 'mobx';
import type ConversationItem from 'owa-mail-list-store/lib/store/schema/ConversationItem';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import type TableViewConversationRelation from 'owa-mail-list-store/lib/store/schema/TableViewConversationRelation';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import getTableToRowRelationKey from 'owa-mail-list-store/lib/utils/getTableToRowRelationKey';
import conversationCache from 'owa-mail-store/lib/store/conversationCache';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type { MruCache } from 'owa-mru-cache';
import { action } from 'satcheljs/lib/legacy';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyRemoveMeetingMessagesFromStore } from 'owa-listview-rsvp';
import { lazyRemoveTxpFromStoreAction } from 'owa-listview-txp';

export interface RemoveConversationDataState {
    tableViewConversationRelations: ObservableMap<string, TableViewConversationRelation>;
    tableViews: ObservableMap<string, TableView>;
    conversationItems: ObservableMap<string, ConversationItem>;
    conversationCache: MruCache<ConversationItemParts>;
}

export default action('removeConversationData')(function removeConversationData(
    rowKey: string,
    tableView: TableView,
    state: RemoveConversationDataState = {
        tableViewConversationRelations: listViewStore.tableViewConversationRelations,
        tableViews: listViewStore.tableViews,
        conversationItems: listViewStore.conversationItems,
        conversationCache: conversationCache,
    }
) {
    const tableConversationRelationKey = getTableToRowRelationKey(rowKey, tableView.id);
    const tableConversationRelations = state.tableViewConversationRelations;
    const conversationId = tableConversationRelations.get(tableConversationRelationKey).id;
    const itemIdsForConversation = tableConversationRelations.get(tableConversationRelationKey)
        .itemIds;
    if (!tableConversationRelations.has(tableConversationRelationKey)) {
        throw new Error('Conversation not found in store');
    }
    // 1. Remove table Conversation relation
    tableConversationRelations.delete(tableConversationRelationKey);
    // 2. Check to see if there are any other table relations for this converation
    let converationFoundInOtherTables = false;
    for (const table of state.tableViews.values()) {
        // We should not refer to the current table
        if (table.id != tableView.id && table.rowIdToRowKeyMap.get(conversationId)) {
            converationFoundInOtherTables = true;
            break;
        }
    }
    // 3. Only remove conversation from listview store when it is not referenced anymore from any table
    if (!converationFoundInOtherTables) {
        state.conversationItems.delete(conversationId);
        // Remove attachment preview well and atttachment view states for this conversation
        lazyRemoveAttachmentPreviews.importAndExecute(conversationId);
        // Remove coupon data
        if (isFeatureEnabled('tri-coupon-peek')) {
            lazyRemoveCouponFromStore.import().then(removeCouponFromStore => {
                removeCouponFromStore(conversationId);
            });
        }
        lazyRemoveMeetingMessagesFromStore.importAndExecute(itemIdsForConversation);
        if (isFeatureEnabled('tri-txpButtonInLV')) {
            lazyRemoveTxpFromStoreAction.importAndExecute(itemIdsForConversation);
        }
        // Remove cached ConversationItemParts from conversationCache if exists
        state.conversationCache.remove(conversationId);
    }
});
