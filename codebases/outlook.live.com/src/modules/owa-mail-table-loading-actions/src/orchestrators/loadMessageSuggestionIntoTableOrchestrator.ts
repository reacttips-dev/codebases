import getConversationNodeId from 'owa-mail-reading-pane-store/lib/utils/getConversationNodeId';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import loadTableViewFromTableQuery from '../actions/loadTableViewFromTableQuery';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import TableOperations from 'owa-mail-list-table-operations';
import updateInstrumentationContext from 'owa-mail-list-store/lib/utils/updateInstrumentationContext';
import { ActionSource, MailListItemSelectionSource } from 'owa-mail-store';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { itemPartSelected, singleSelectRow } from 'owa-mail-actions/lib/mailListSelectionActions';
import { loadMessageSuggestionIntoTable } from 'owa-mail-search/lib/actions/publicActions';
import type { MailListRowDataType } from 'owa-mail-list-store';
import { orchestrator } from 'satcheljs';
import type { SearchTableQuery } from 'owa-mail-list-search';

const orchestratorInternal = actionMessage => {
    const actionSource: ActionSource = actionMessage.actionSource as ActionSource;
    const row: MailListRowDataType = actionMessage.row;
    const searchTableQuery: SearchTableQuery = actionMessage.searchTableQuery;
    const referenceId: string = actionMessage.referenceId;
    const traceId: string = actionMessage.traceId;
    const itemPartId: string = actionMessage.itemPartId;

    const tableView = getTableViewFromTableQuery(searchTableQuery);

    // add the single item into the table
    TableOperations.clear(tableView);
    TableOperations.addRow(0, row, tableView);

    loadTableViewFromTableQuery(searchTableQuery, null /* loadTableViewDatapoint */, actionSource);

    // instrumentation needs to be added before selecting the item
    // so the instrumentation context is available for logging ReadingPaneDisplayStart
    const instrumentationContext = <InstrumentationContext>{
        referenceKey: referenceId,
        index: 0, // there's a single item in the table and its row index is 0
        traceId: traceId,
    };

    updateInstrumentationContext(row.InstanceKey, tableView, instrumentationContext);

    // auto select the first and the only item
    singleSelectRow(
        tableView,
        tableView.rowKeys[0],
        false /* isUserNavigation */,
        MailListItemSelectionSource.SearchSuggestionClick
    );

    // itemPartId is only available for conversation view
    // call itemPartSelected to scroll to it
    if (searchTableQuery.listViewType == ReactListViewType.Conversation && itemPartId) {
        const nodeId = getConversationNodeId(row.ConversationId.Id, itemPartId);
        const conversationItemParts = getMailStore().conversations.get(row.ConversationId.Id);
        const conversationNodeIds = conversationItemParts
            ? conversationItemParts.conversationNodeIds
            : [];

        itemPartSelected(
            nodeId,
            itemPartId,
            conversationNodeIds,
            tableView,
            MailListItemSelectionSource.MailListItemExpansion
        );
    }
};

export default orchestrator(loadMessageSuggestionIntoTable, actionMessage => {
    orchestratorInternal(actionMessage);
});
