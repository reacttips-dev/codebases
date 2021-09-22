import markItemsAsReadBasedOnItemIds from '../../helpers/markItemsAsReadBasedOnItemIds';
import {
    TableView,
    getRowKeysFromRowIds,
    getContextFolderIdForTable,
    isConversationView,
} from 'owa-mail-list-store';
import { action } from 'satcheljs/lib/legacy';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type { ActionSource } from 'owa-analytics-types';
import mailStore from 'owa-mail-store/lib/store/Store';
import {
    onTriageActionCompleted,
    onTriageActionFailed,
} from 'owa-mail-triage-action-response-processor';

export default action('markItemAsReadFromReadingPane')(function markItemAsReadFromReadingPane(
    itemId: string,
    tableView: TableView,
    isReadValue: boolean,
    instrumentationContexts: InstrumentationContext[],
    actionSource: ActionSource
) {
    let rowKeys = [];
    let contextFolderId = null;

    // TableView is null in Files hubs
    if (tableView) {
        if (isConversationView(tableView)) {
            const item = mailStore.items.get(itemId);
            const conversationId = item.ConversationId.Id;
            rowKeys = getRowKeysFromRowIds([conversationId], tableView);
        } else {
            rowKeys = getRowKeysFromRowIds([itemId], tableView);
        }

        contextFolderId = getContextFolderIdForTable(tableView);
    }

    markItemsAsReadBasedOnItemIds(
        tableView,
        [itemId],
        isReadValue,
        true /* isExplicit */,
        actionSource,
        instrumentationContexts
    )
        .then(() => {
            if (tableView) {
                onTriageActionCompleted(rowKeys, contextFolderId);
            }
        })
        .catch(error => {
            if (tableView) {
                onTriageActionCompleted(rowKeys, contextFolderId);
                onTriageActionFailed(tableView);
            }
        });
});
