import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { SearchTableQuery } from 'owa-mail-list-search';
import type { ClientItem } from 'owa-mail-store';
import type { ClientItemId } from 'owa-client-ids';
import { getCurrentTableMailboxInfo } from 'owa-mail-mailboxinfo';
import {
    getSelectedTableView,
    MailListRowDataType,
    TableQueryType,
    isConversationView,
} from 'owa-mail-list-store';
import { getStore as getMailSearchStore } from '../store/store';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { START_MATCH_DELIMITER_REGEXP, END_MATCH_DELIMITER_REGEXP } from 'owa-search-constants';
import { lazyLoadConversation, lazyLoadItem } from 'owa-mail-store-actions';
import { loadMessageSuggestion } from '../actions/internalActions';
import { loadMessageSuggestionIntoTable } from '../actions/publicActions';
import { orchestrator } from 'satcheljs';

orchestrator(loadMessageSuggestion, async actionMessage => {
    const suggestion = actionMessage.suggestion;

    if (isConversationView(getSelectedTableView())) {
        const conversationIdString = suggestion.ConversationId.Id;
        const cachedConversation = getMailStore().conversations.get(conversationIdString);

        if (!cachedConversation) {
            // make a get convesation item call if the data is not already available in cache
            const conversationId: ClientItemId = {
                Id: conversationIdString,
                mailboxInfo: getCurrentTableMailboxInfo(),
            };
            await lazyLoadConversation.importAndExecute(
                conversationId,
                'LoadSearchSuggestionConversation'
            );
        }

        const itemIds = getItemIdsFromConversationItemParts(conversationIdString);

        // since we don't have the converstion data to display in list view
        // this is a best effort in putting together the necessary properties for the
        // conversation to display in the list view
        const conversation: ConversationType = {
            __typename: 'ConversationType',
            ConversationId: { Id: conversationIdString },
            ConversationTopic: dehighlightText(suggestion.Subject),
            GlobalUnreadCount: 0,
            UnreadCount: 0,
            GlobalItemIds: itemIds,
            ItemIds: itemIds,
            UniqueSenders: [dehighlightText(suggestion.DisplayName)],
            LastDeliveryTime: suggestion.DateTimeReceived,
            LastDeliveryOrRenewTime: suggestion.DateTimeReceived,
            LastModifiedTime: suggestion.DateTimeReceived,
            InstanceKey: '0',
        };

        loadSearchTableWithMessageSuggestion(
            conversation,
            suggestion.ReferenceId,
            suggestion.ItemId.Id
        );
    } else {
        const cachedItem = getMailStore().items.get(suggestion.ItemId.Id);

        if (cachedItem?.NormalizedBody) {
            loadSearchTableWithMessageSuggestion(cachedItem as ItemRow, suggestion.ReferenceId);
        } else {
            const itemId: ClientItemId = {
                Id: suggestion.ItemId.Id,
                mailboxInfo: getCurrentTableMailboxInfo(),
            };
            let loadedItem = await lazyLoadItem.importAndExecute(
                itemId,
                'LoadSearchSuggestionItem'
            );

            if (!loadedItem) {
                // this handles the scenario where the item has been moved to a different folder and
                // can no longer be found in store, while the suggestion index still contain stale item id
                // fallback to the last item of the conversation instead
                loadedItem = await loadLatestConversationItem(suggestion.ConversationId.Id);
            }

            loadSearchTableWithMessageSuggestion(loadedItem as ItemRow, suggestion.ReferenceId);
        }
    }
});

async function loadLatestConversationItem(conversationIdString: string): Promise<ClientItem> {
    const cachedConversation = getMailStore().conversations.get(conversationIdString);
    const conversationId: ClientItemId = {
        Id: conversationIdString,
        mailboxInfo: getCurrentTableMailboxInfo(),
    };

    if (!cachedConversation) {
        await lazyLoadConversation.importAndExecute(
            conversationId,
            'LoadSearchSuggestionConversation'
        );
    }

    const itemId = getLatestItemId(conversationId);
    return lazyLoadItem.importAndExecute(itemId, 'LoadSearchSuggestionItem');
}

function loadSearchTableWithMessageSuggestion(
    row: MailListRowDataType,
    referenceId: string,
    itemPartId?: string
) {
    const mailSearchStore = getMailSearchStore();
    const searchStore = getScenarioStore(SearchScenarioId.Mail);

    const searchTableQuery = {
        folderId: null,
        type: TableQueryType.Search,
        listViewType: getSelectedTableView().tableQuery.listViewType,
        searchNumber: mailSearchStore.searchNumber,
        queryString: searchStore.searchTextForSuggestion,
        searchScope: mailSearchStore.staticSearchScope,
        pillSuggestions: [...searchStore.suggestionPills.values()],
        includeAttachments: mailSearchStore.includeAttachments,
        fromDate: mailSearchStore.fromDate,
        toDate: mailSearchStore.toDate,
        scenarioType: 'messageSuggestion',
    };

    loadMessageSuggestionIntoTable(
        'SearchBoxSuggestionDropDown',
        row,
        searchTableQuery as SearchTableQuery,
        referenceId,
        searchStore.latestTraceId,
        itemPartId
    );
}

function dehighlightText(text: string): string {
    return text.replace(START_MATCH_DELIMITER_REGEXP, '').replace(END_MATCH_DELIMITER_REGEXP, '');
}

function getItemIdsFromConversationItemParts(conversationId: string): BaseItemId[] {
    const conversationItemParts = getMailStore().conversations.get(conversationId);
    const conversationNodeIds = conversationItemParts
        ? conversationItemParts.conversationNodeIds
        : [];
    const allItemIds = [];

    conversationNodeIds.forEach(conversationNodeId => {
        const conversationNode = getMailStore().conversationNodes.get(conversationNodeId);
        const itemIds = conversationNode ? conversationNode.itemIds : [];
        itemIds.forEach(id => {
            allItemIds.push({ Id: id });
        });
    });

    return allItemIds;
}

function getLatestItemId(conversationId: ClientItemId): ClientItemId {
    const itemIds = getItemIdsFromConversationItemParts(conversationId.Id);
    const index = isNewestOnBottom() ? itemIds.length - 1 : 0;

    return {
        mailboxInfo: conversationId.mailboxInfo,
        Id: (<ItemId>itemIds[index]).Id,
    };
}
