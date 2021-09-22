import type { ConversationType } from 'owa-graph-schema';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { isConversationSortKeyEqual } from './helpers/isSortKeyEqual';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import appendRowResponse from './appendRowResponse';

export default function appendConversationWithSeekToConditionResponse(
    tableView: TableView,
    conversations: ConversationType[],
    conversationsInView: number
) {
    // Server did not return anything
    if (!conversations || conversations.length == 0) {
        return;
    }

    // The first conversation would be the last conversation from the previous FindConversation response.
    // We check if we have that conversation and do a sort key comparision
    const conversationInstanceKeyUsedForSeekConditionRequest = conversations[0].InstanceKey;
    const tableViewConversationRelation = getTableConversationRelation(
        conversationInstanceKeyUsedForSeekConditionRequest,
        tableView.id
    );

    if (
        !tableViewConversationRelation ||
        !isConversationSortKeyEqual(
            tableView.tableQuery,
            tableViewConversationRelation,
            conversations[0]
        )
    ) {
        // Do not process the response if the last item which was used as an instance key
        // to get the next 'n' items has
        // 1) moved in place in the table
        // Because at this point the state on the server might have changed a lot e.g. new rows might have got
        // added after this item in question and we would end up appending the new rows after the existing rows if we
        // proceed and hence we discard.
        // 2) Or the row has been deleted on client in which case we do not have anything to compare to.
        // In both above cases we would rely on the row notifications or user scrolling to get more items.
        return;
    }

    appendRowResponse(tableView, conversations, conversationsInView, 'AppendOnLoadMore');
}
