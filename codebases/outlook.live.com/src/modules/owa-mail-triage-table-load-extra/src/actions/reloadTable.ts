import { onReloadTableFailed, onReloadTableSucceeded } from './helpers/onReloadTableCompleted';
import { logUsage } from 'owa-analytics';
import { apolloErrorToResponseCode } from 'owa-apollo-errors/lib/apolloErrorToResponseCode';
import { isFeatureEnabled } from 'owa-feature-flags';
import getFolderData from 'owa-mail-actions/lib/getFolderData';
import { findItemWithStartIndex, getConversationRows, getItemRows } from 'owa-mail-find-rows';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { INITIAL_LOAD_ROW_COUNT } from 'owa-mail-triage-table-utils';
import getMailItemSortByProperty from 'owa-mail-triage-table-utils/lib/getMailItemSortByProperty';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type FolderId from 'owa-service/lib/contract/FolderId';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { TaskQueue } from 'owa-task-queue';
import { action } from 'satcheljs/lib/legacy';
import {
    TableView,
    getBaseFolderId,
    getBaseServerFolderId,
    MailFolderTableQuery,
    TableQueryType,
    isFolderPaused,
    getStore,
} from 'owa-mail-list-store';
import {
    getMailboxInfoFromTableQuery,
    getMailboxRequestOptionsFromTableQuery,
} from 'owa-mail-mailboxinfo';
import type { ItemRow } from 'owa-graph-schema';

export interface ReloadTableTaskProps {
    tableViewId: string;
}

export const reloadTableTaskQueue = new TaskQueue<ReloadTableTaskProps>(
    1 /* max number of reload tasks */,
    reloadTableTask,
    150 /* taskDelay */
);

/**
 * Reload the given table view
 * @param tableView to be reloaded
 */
export default action('reloadMailListTableAction')(function reloadTable(tableView: TableView) {
    /**
     * Do not reload if
     * 1) This is a search table
     * 2) This is a table for a folder that is currently paused as there is not reason to keep
     * table up-to-date for paused folder
     */
    if (
        tableView.tableQuery.type === TableQueryType.Search ||
        isFolderPaused(tableView.tableQuery.folderId)
    ) {
        return;
    }

    // We are queueing this because when notification channel reconnects after some period of disconnect,
    // we get a surge of reload notifications reloading all the tables in the list view store.
    // If we don't queue these, all find and getFolder calls will go out the same time and
    // this can take down the server and make everything slower.
    reloadTableTaskQueue.add({
        tableViewId: tableView.id,
    });
});

/**
 * Reload table tasks, issues a find and getFolder call
 * @param reloadTableProps
 */
export async function reloadTableTask(reloadTableProps: ReloadTableTaskProps): Promise<any> {
    const tableViewId = reloadTableProps.tableViewId;
    const tableView = getStore().tableViews.get(tableViewId);

    // No-op if the table is deleted from store, by the time this task needs to be executed.
    if (!tableView) {
        return Promise.resolve();
    }

    // let CI be currentLoadedIndex
    // Case 1: if CI < INITIAL_LOAD_ROW_COUNT, request INITIAL_LOAD_ROW_COUNT rows, the reason is server may have more rows
    // and we would like to fill our viewport with more rows
    // Case 2: if CI >= INITIAL_LOAD_ROW_COUNT, request CI rows
    // In case 2 we would want to optimize reload performance,
    // since we currently will load all items that are in currentLoadedIndex - VSO: 11814
    const rowsToReload = Math.max(tableView.currentLoadedIndex, INITIAL_LOAD_ROW_COUNT);

    // Reload all items that we have, otherwise rows may be in an inconsistent state
    // We need to pass in the reload datapoint, because it is used in the async callback to log the service error
    // TODO: 11814: Optimize reload performance since we currently reload all items that we have
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            await reloadConversationTable(tableView, rowsToReload);
            break;

        case ReactListViewType.Message:
            await reloadItemTable(tableView, rowsToReload);
            break;
    }

    // Also refresh counts for folder
    if (tableView.tableQuery.type == TableQueryType.Folder) {
        getFolderData(tableView.tableQuery.folderId);
    }

    // log number of rows reloaded
    logUsage('ReloadTable', [rowsToReload], { sessionSampleRate: 10 });

    return Promise.resolve();
}

/**
 * Reload the conversation table using Graph QL
 * @param tableView the conversation table view to be reloaded
 * @param rowsToReload the number of rows to reload
 */
function reloadConversationTable(tableView: TableView, rowsToReload: number) {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const serverBaseFolderId = getBaseServerFolderId(
        tableView,
        true /* returnNullIfSameAsFolderId */
    );
    const serverFolderId = (serverBaseFolderId as FolderId)?.Id;

    return getConversationRows(
        mailTableQuery.folderId,
        rowsToReload,
        mailTableQuery.viewFilter,
        mailTableQuery.sortBy,
        shouldTableSortByRenewTime(mailTableQuery),
        mailTableQuery.focusedViewFilter,
        mailTableQuery.requestShapeName,
        getMailboxInfoFromTableQuery(mailTableQuery),
        undefined, // lastInstanceKey
        mailTableQuery.categoryName,
        serverFolderId
    )
        .then(responseMessage => {
            let conversationTypes = [];

            if (responseMessage.edges) {
                conversationTypes = responseMessage.edges.map(edge => edge.node);
            }

            onReloadTableSucceeded(
                tableView,
                conversationTypes,
                responseMessage.totalConversationRowsInView
            );
        })
        .catch((error: any) => {
            const responseCode = apolloErrorToResponseCode(error);
            onReloadTableFailed(responseCode);
        });
}

/**
 * Reload the item table
 * @param tableView the item table view to be reloaded
 * @param number of rows to reload
 */
function reloadItemTable(tableView: TableView, rowsToReload: number) {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;

    if (isFeatureEnabled('mon-messageList-useGqlForFindItem')) {
        return getItemRows(
            getBaseFolderId(mailTableQuery),
            rowsToReload,
            mailTableQuery.viewFilter,
            mailTableQuery.sortBy,
            shouldTableSortByRenewTime(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            getMailboxInfoFromTableQuery(mailTableQuery),
            undefined,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */)
        )
            .then(responseMessage => {
                let items = [];

                if (responseMessage.edges) {
                    items = responseMessage.edges.map(edge => edge.node);
                }

                onReloadTableSucceeded(tableView, items, responseMessage.totalItemRowsInView);
            })
            .catch((error: any) => {
                const responseCode = apolloErrorToResponseCode(error);
                onReloadTableFailed(responseCode);
            });
    } else {
        return findItemWithStartIndex(
            getBaseFolderId(mailTableQuery),
            0 /* startIndex */,
            rowsToReload,
            mailTableQuery.viewFilter,
            getMailItemSortByProperty(mailTableQuery),
            mailTableQuery.focusedViewFilter,
            mailTableQuery.requestShapeName,
            undefined,
            getMailboxRequestOptionsFromTableQuery(mailTableQuery),
            mailTableQuery.categoryName,
            getBaseServerFolderId(tableView, true /* returnNullIfSameAsFolderId */)
        )
            .then((responseMessage: FindItemResponseMessage) => {
                if (responseMessage.ResponseClass == 'Success') {
                    onReloadTableSucceeded(
                        tableView,
                        <ItemRow[]>responseMessage.RootFolder.Items,
                        responseMessage.RootFolder.TotalItemsInView
                    );
                } else {
                    onReloadTableFailed(responseMessage.ResponseCode);
                }
            })
            .catch(error => {
                onReloadTableFailed();
            });
    }
}
