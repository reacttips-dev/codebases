import datapoints from '../datapoints';
import * as suppressedItemIdsMapOperations from '../helpers/suppressedItemIdsMapOperations';
import { lazyAddMarkAsReadDiagnostics } from 'owa-group-readunread-diagnostics';
import { userMailInteractionAction } from 'owa-mail-actions';
import markConversationsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsReadStoreUpdate';
import {
    MailRowDataPropertyGetter,
    TableView,
    getApplyConversationActionContext,
    getTableConversationRelation,
    shouldRemoveRowOnMarkReadAction,
    canTableBeOutOfSyncWithServer,
} from 'owa-mail-list-store';
import getContextFolderIdForTable from 'owa-mail-list-store/lib/utils/getContextFolderIdForTable';
import { getMailboxRequestOptionsFromTableQuery } from 'owa-mail-mailboxinfo';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { trace } from 'owa-trace';
import type { ActionSource } from 'owa-analytics-types';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { processApplyConversationActionResponseMessage } from 'owa-mail-triage-action-response-processor';
import filterConversationsByIsReadValue from './filterConversationsByIsReadValue';
import { markItemsAsReadMutationWithErrorHandling } from './markItemsAsReadBasedOnItemIds';
import type { MailboxInfoInput } from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import type { ApplyConversationActionContext } from 'owa-mail-triage-action-utils';
import {
    MarkConversationAsReadDocument,
    MarkConversationAsReadMutation,
} from '../graphql/__generated__/markConversationAsReadMutation.interface';
import getEwsRequestDateString from 'owa-mail-triage-action-utils/lib/getEwsRequestDateString';

type MarkConversationAsReadResult = MarkConversationAsReadMutation['markConversationAsRead'];

export default wrapFunctionForDatapoint(
    datapoints.markConversationAsRead,
    function markConversationsAsReadBasedOnConversationIds(
        conversationIds: string[],
        tableView: TableView,
        isReadValue: boolean,
        isExplicit: boolean,
        actionSource: ActionSource,
        instrumentationContexts: InstrumentationContext[],
        rowKeys: string[]
    ): Promise<void> {
        const rowKeysToUpdate = filterConversationsByIsReadValue(
            rowKeys,
            tableView.id,
            isReadValue
        );
        if (rowKeysToUpdate.length == 0) {
            // Nothing to update
            return Promise.resolve();
        }

        // Update suppressed state if user explicitly marks a single selected conversation as read/unread
        if (conversationIds.length == 1 && tableView.selectedRowKeys.size == 1) {
            const conversationId = MailRowDataPropertyGetter.getRowIdString(
                rowKeysToUpdate[0],
                tableView
            );
            const selectedConversationRowRelation = getTableConversationRelation(
                [...tableView.selectedRowKeys.keys()][0],
                tableView.id
            );
            if (conversationId == selectedConversationRowRelation.id) {
                const itemIds = selectedConversationRowRelation.itemIds;

                if (isReadValue) {
                    // If mark the conversation read, always remove all item ids and clear the timestamp
                    suppressedItemIdsMapOperations.clear();
                } else {
                    if (isExplicit) {
                        // If mark conversation as unread explicitly, set the suppressed state by adding all itemIds
                        suppressedItemIdsMapOperations.add(itemIds);
                    } else {
                        trace.warn('Invalid scenario to implicitly mark conversation as unread.');
                    }
                }
            }
        }

        // 1. Make instant update in the store
        markConversationsAsReadStoreUpdate(conversationIds, tableView.id, isReadValue, isExplicit);

        // Tracking the mark as read operation for the diagnostics panel
        lazyAddMarkAsReadDiagnostics.import().then(addMarkAsReadDiagnostics => {
            addMarkAsReadDiagnostics(
                tableView.tableQuery,
                false /* isActingOnAllItemsInTable */,
                isReadValue,
                actionSource,
                conversationIds
            );
        });

        const triageContext = {
            conversationIds,
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

        // Perform item level operation if the table is out of sync with server and server may not have
        // knowledge of this conversation in the given context
        if (canTableBeOutOfSyncWithServer(tableView)) {
            return performItemLevelMarkReadOperation(
                tableView,
                rowKeysToUpdate,
                isReadValue,
                isExplicit,
                mailboxInfo
            );
        } else {
            return performConversationLevelMarkReadOperation(
                tableView,
                rowKeysToUpdate,
                isReadValue,
                isExplicit,
                mailboxInfo
            );
        }
    }
);

function performItemLevelMarkReadOperation(
    tableView: TableView,
    conversationRowKeysToUpdate: string[],
    isReadValue: boolean,
    isUserInitiated: boolean,
    mailboxInfo: MailboxInfoInput
): Promise<void> {
    const itemIdsToUpdate = [];
    conversationRowKeysToUpdate.forEach(rowKey => {
        itemIdsToUpdate.push(...MailRowDataPropertyGetter.getItemIds(rowKey, tableView));
    });

    return markItemsAsReadMutationWithErrorHandling(
        tableView,
        conversationRowKeysToUpdate,
        itemIdsToUpdate,
        isReadValue,
        isUserInitiated,
        mailboxInfo
    );
}

function performConversationLevelMarkReadOperation(
    tableView: TableView,
    rowKeysToUpdate: string[],
    isReadValue: boolean,
    isExplicit: boolean,
    mailboxInfo: MailboxInfoInput
) {
    const contextFolderId = getContextFolderIdForTable(tableView);
    const conversationActionContexts = rowKeysToUpdate.map(rowKey =>
        getApplyConversationActionContext(rowKey, tableView.id)
    );

    const markConversationsAsReadPromise = exportedHelperFunctions.invokeMarkConversationAsReadMutation(
        conversationActionContexts,
        isReadValue,
        isExplicit,
        contextFolderId,
        mailboxInfo
    );

    const shouldRemoveRowsFromTombstone = shouldRemoveRowOnMarkReadAction(
        tableView,
        isReadValue,
        isExplicit
    );
    return processApplyConversationActionResponseMessage(
        markConversationsAsReadPromise,
        rowKeysToUpdate,
        contextFolderId,
        tableView,
        shouldRemoveRowsFromTombstone,
        true // skipCheckingResponseMessage
    );
}

const invokeMarkConversationAsReadMutationFn = async function invokeMarkConversationAsReadMutation(
    conversationContexts: ApplyConversationActionContext[],
    isReadValue: boolean,
    isUserInitiated: boolean,
    contextFolderId: string,
    mailboxInfo: MailboxInfoInput
): Promise<MarkConversationAsReadResult> {
    const conversationSnapShots = conversationContexts.map(context => {
        return {
            id: context.conversationId,
            messagesAsOf: getEwsRequestDateString(context.conversationLastSyncTimeStamp),
        };
    });
    const client = getApolloClient();
    const result = await client.mutate({
        variables: {
            conversations: conversationSnapShots,
            isRead: isReadValue,
            isUserInitiated: isUserInitiated,
            folderId: contextFolderId,
            mailboxInfo: mailboxInfo,
        },
        mutation: MarkConversationAsReadDocument,
    });

    return result?.data?.markConversationAsRead;
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeMarkConversationAsReadMutation: invokeMarkConversationAsReadMutationFn,
};
