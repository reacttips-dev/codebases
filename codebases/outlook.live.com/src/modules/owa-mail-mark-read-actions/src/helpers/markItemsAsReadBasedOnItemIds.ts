import datapoints from '../datapoints';
import filterItemsByIsReadValue from '../helpers/filterItemsByIsReadValue';
import * as suppressedItemIdsMapOperations from '../helpers/suppressedItemIdsMapOperations';
import { lazyAddMarkAsReadDiagnostics } from 'owa-group-readunread-diagnostics';
import { userMailInteractionAction } from 'owa-mail-actions';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import { listViewStore, TableView, getRowKeysFromRowIds } from 'owa-mail-list-store';
import { getMailboxRequestOptionsFromTableQuery } from 'owa-mail-mailboxinfo';
import { lazyGetIdsForTriageActions } from 'owa-mail-store-unstacked';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { trace } from 'owa-trace';
import type { ActionSource } from 'owa-analytics-types';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { onTriageActionCompleted } from 'owa-mail-triage-action-response-processor';
import { getApolloClient } from 'owa-apollo';
import {
    MarkItemAsReadDocument,
    MarkItemAsReadMutation,
} from '../graphql/__generated__/markItemAsReadMutation.interface';
import type { MailboxInfoInput } from 'owa-graph-schema';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

type MarkItemAsReadResult = MarkItemAsReadMutation['markItemAsRead'];

/**
 * Mark the specified conversations as read or unread based on the isReadValue
 * @param tableView the tableView containing the item being marked as read/unread
 * @param itemId the item id
 * @param isReadValue the isRead value to set
 * @param isExplicit whether the mark as read action is initiated explicitly by user
 */
export default wrapFunctionForDatapoint(
    datapoints.markItemReadUnread,
    async function markItemsAsReadBasedOnItemIds(
        tableView: TableView,
        itemIds: string[],
        isReadValue: boolean,
        isExplicit: boolean,
        actionSource: ActionSource,
        instrumentationContexts: InstrumentationContext[]
    ): Promise<void> {
        const itemIdsToUpdate = filterItemsByIsReadValue(itemIds, isReadValue);
        if (itemIdsToUpdate.length == 0) {
            // Nothing to mark as read
            return Promise.resolve();
        }

        if (isReadValue) {
            // If mark as read, always clear the suppressed state by removing item id
            suppressedItemIdsMapOperations.remove(itemIdsToUpdate);
        } else {
            if (isExplicit) {
                // If user explicitly mark item as unread, set the suppressed state by adding the item id.
                // The item doesn't necessarily needs to be selected. For example, when user marks unread on unselected expanded items, they should be
                // added to the suppression itemIds map, to keep them unread after user navigates away to another conversation.
                suppressedItemIdsMapOperations.add(itemIdsToUpdate);
            } else {
                trace.warn('Invalid scenario to implicitly mark item as unread.');
            }
        }

        // 1. Make instant update in the store
        // Tableview is null when OWA loads in fileshub.
        // and we do not want to make listview store updates when OWA is loaded in Fileshub
        const tableViewId = tableView ? tableView.id : null;

        markItemsAsReadStoreUpdate(itemIdsToUpdate, isReadValue, isExplicit, tableViewId);

        // Tracking the mark as read operation for the diagnostics panel
        lazyAddMarkAsReadDiagnostics.import().then(addMarkAsReadDiagnostics => {
            addMarkAsReadDiagnostics(
                tableView ? tableView.tableQuery : null,
                false /* isActingOnAllItemsInTable */,
                isReadValue,
                actionSource,
                itemIdsToUpdate
            );
        });

        const triageContext = {
            itemIds: itemIdsToUpdate,
        };

        if (!isReadValue) {
            userMailInteractionAction('MarkAsUnread', instrumentationContexts, triageContext);
        } else if (isExplicit) {
            userMailInteractionAction('MarkAsRead', instrumentationContexts, triageContext);
        } else {
            userMailInteractionAction('MarkAsReadImplicit', instrumentationContexts, triageContext);
        }

        // 2. Make service request
        const { mailboxInfo } = getMailboxRequestOptionsFromTableQuery(tableView.tableQuery);

        const rowKeys = tableView ? getRowKeysFromRowIds(itemIdsToUpdate, tableView) : [];
        return markItemsAsReadMutationWithErrorHandling(
            tableView,
            rowKeys,
            itemIdsToUpdate,
            isReadValue,
            isExplicit,
            mailboxInfo
        );
    }
);

export async function markItemsAsReadMutationWithErrorHandling(
    tableView: TableView,
    rowKeys: string[],
    ids: string[],
    isRead: boolean,
    isUserInitiated: boolean,
    mailboxInfo: MailboxInfoInput
): Promise<void> {
    const getIdsForTriageActions = await lazyGetIdsForTriageActions.import();
    const forks = listViewStore.expandedConversationViewState?.forks;
    const itemIdsToActOn = getIdsForTriageActions(ids, forks);

    const userConfiguration = getUserConfiguration();
    const suppressReadReceipts = userConfiguration.UserOptions.ReadReceipt != 'AlwaysSend';

    try {
        await exportedHelperFunctions.invokeMarkItemAsReadMutation(
            itemIdsToActOn,
            isRead,
            suppressReadReceipts,
            isUserInitiated,
            mailboxInfo
        );
        return;
    } catch (error) {
        const serverFolderId = tableView ? tableView.serverFolderId : null;
        onTriageActionCompleted(rowKeys, serverFolderId, true /* shouldRemoveRowsFromTombstone */);
        return Promise.reject(error);
    }
}

const invokeMarkItemAsReadMutationFn = async function invokeMarkItemAsReadMutation(
    ids: string[],
    isRead: boolean,
    suppressReadReceipts: boolean,
    isUserInitiated: boolean,
    mailboxInfo: MailboxInfoInput
): Promise<MarkItemAsReadResult> {
    const client = getApolloClient();
    const result = await client.mutate({
        variables: {
            ids: ids,
            isRead: isRead,
            suppressReadReceipts: suppressReadReceipts,
            isUserInitiated: isUserInitiated,
            mailboxInfo: mailboxInfo,
        },
        mutation: MarkItemAsReadDocument,
    });

    return result?.data?.markItemAsRead;
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeMarkItemAsReadMutation: invokeMarkItemAsReadMutationFn,
};
