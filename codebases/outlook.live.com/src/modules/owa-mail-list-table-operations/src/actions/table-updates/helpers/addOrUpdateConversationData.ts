import mapConversationTypeToConversationItem from '../../store-factory/mapConversationTypeToConversationItem';
import mapConversationTypeToConversationRelation from '../../store-factory/mapConversationTypeToConversationRelation';
import type { ObservableMap } from 'mobx';
import type { ConversationType } from 'owa-graph-schema';
import {
    addNodeAsFork,
    ConversationItem,
    getTableToRowRelationKey,
    listViewStore,
    MailRowDataPropertyGetter,
    TableView,
    TableViewConversationRelation,
} from 'owa-mail-list-store';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import type ItemId from 'owa-service/lib/contract/ItemId';
import * as trace from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

export interface AddOrUpdateConversationDataState {
    conversationItems: ObservableMap<string, ConversationItem>;
    tableViewConversationRelations: ObservableMap<string, TableViewConversationRelation>;
}

/**
 * Adds or updated the conversation in the tableView, tableViewConversationRelations
 * This is called whenever a data is fetched from the server and is being stored. This is also called when
 * a rowAdd or rowModified notification occurs
 * @param conversation to add or update
 * @param tableId where to add or update the conversation
 * @param doNotOverwriteData determines if updates should be written (default is false)
 * @param state for unit testing
 */
export default action('addOrUpdateConversationData')(function addOrUpdateConversationData(
    conversation: ConversationType,
    tableView: TableView,
    doNotOverwriteData: boolean = false,
    state: AddOrUpdateConversationDataState = {
        conversationItems: listViewStore.conversationItems,
        tableViewConversationRelations: listViewStore.tableViewConversationRelations,
    }
) {
    const { conversationItems, tableViewConversationRelations } = state;
    if (!conversation.ConversationId) {
        trace.errorThatWillCauseAlert('addOrUpdateConversationData: ConversationId is undefined');
    }
    const conversationId = conversation.ConversationId.Id;
    const tableConversationRelationKey = getTableToRowRelationKey(
        conversation.InstanceKey,
        tableView.id
    );
    if (shouldModifyConversationItems(doNotOverwriteData, conversationId, conversationItems)) {
        const conversationItem = mapConversationTypeToConversationItem(conversation, tableView);
        conversationItems.set(conversationId, conversationItem);
    }
    // Create or update the relation object
    const newRelation = mapConversationTypeToConversationRelation(conversation, tableView);
    if (shouldShowUnstackedReadingPane() && isNewLocalMessage(conversation, tableView)) {
        addNodeAsFork(conversation.InstanceKey, (conversation.ItemIds[0] as ItemId).Id);
    }

    tableViewConversationRelations.set(tableConversationRelationKey, newRelation);
});

/**
 * Helper function to check if the conversationItems map should be modified.
 */
const shouldModifyConversationItems = (
    doNotOverwriteData: boolean,
    conversationId: string,
    conversationItems: ObservableMap<string, ConversationItem>
): boolean => {
    /**
     * If the conversation is new (an add) then we should add it to the
     * conversationItems map.
     */
    const cachedConversationItem = conversationItems.get(conversationId);
    if (!cachedConversationItem) {
        return true;
    }

    /**
     * If the conversation already exists in the store (an update), then respect
     * the parameter passed in by the caller.
     */
    if (doNotOverwriteData) {
        return false;
    }

    return true;
};

const isNewLocalMessage = (conversation: ConversationType, tableView: TableView): boolean => {
    const rowKey = conversation.InstanceKey;
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    if (selectedRowKeys.length == 1 && rowKey === selectedRowKeys[0]) {
        const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
        if (itemIds && itemIds.length < conversation.MessageCount) {
            return true;
        }
    }
    return false;
};
