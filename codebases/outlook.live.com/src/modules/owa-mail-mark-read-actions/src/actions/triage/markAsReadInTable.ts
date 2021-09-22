import markConversationsAsReadFromTable from './markConversationsAsReadFromTable';
import markItemsAsReadFromTable from './markItemsAsReadFromTable';
import getMarkAsReadUnreadAllConfirmText from '../../helpers/getMarkAsReadUnreadAllConfirmText';
import { logUsage } from 'owa-analytics';
import { ActionSource, isCommandingViewActionSource } from 'owa-analytics-types';
import { getApolloClient } from 'owa-apollo';
import { getCategoryUnreadCount } from 'owa-categories';
import { confirm, ConfirmCustomizationOptions, DialogResponse } from 'owa-confirm-dialog';
import { getISOString } from 'owa-datetime';
import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import { lazyAddMarkAsReadDiagnostics } from 'owa-group-readunread-diagnostics';
import loc from 'owa-localize';
import { okButton } from 'owa-locstrings/lib/strings/okbutton.locstring.json';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
import {
    getFolderScopeText,
    getBaseServerFolderId,
    listViewStore,
    isFolderPaused,
    getFocusedFilterForTable,
    getRowIdsFromRowKeys,
    getIsEverythingSelectedInTable,
    getUserCategoryName,
    isFilteredTableView,
    getViewFilterForTable,
    TableQueryType,
    TableView,
    MailFolderTableQuery,
    getGqlViewFilterFromOwsViewFilter,
    getGqlFocusedViewFilterFromOwsFocusedViewFilter,
} from 'owa-mail-list-store';
import getConversationIdsFromConversations from 'owa-mail-list-store/lib/utils/getConversationIdsFromConversations';
import getItemIdsFromConversations from 'owa-mail-list-store/lib/utils/getItemIdsFromConversations';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { NUMBER_OF_SELECTED_ITEMS_THRESHOLD } from 'owa-mail-store/lib/utils/bulkTriageConstants';
import isSharedFolder from 'owa-mail-store/lib/utils/isSharedFolder';
import * as undoActions from 'owa-mail-undo';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { action } from 'satcheljs/lib/legacy';
import {
    MarkViewAsReadDocument,
    MarkViewAsReadMutation,
    MarkViewAsReadMutationVariables,
} from '../graphql/__generated__/MarkViewAsReadMutation.interface';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type DistinguishedFolderId from 'owa-service/lib/contract/DistinguishedFolderId';

type MarkViewAsReadResult = MarkViewAsReadMutation['markViewAsRead'];

/**
 * REMARK: exclusionList and isinVirtualSelectMode (which is generally what's
 * used for isActingOnAllItemsInTable) is not read from tableView due to specific
 * special-cases, primarily "Mark all as read" command or when we're in search
 * results where there is no backing folder.
 */
export default action('markAsReadInTable')(function markAsReadInTable(
    actionSource: ActionSource,
    exclusionList: string[],
    isActingOnAllItemsInTable: boolean,
    isReadValueToSet: boolean,
    rowKeysToActOn: string[],
    tableView: TableView,
    isMarkViewAsRead?: boolean
) {
    if (rowKeysToActOn.length && isActingOnAllItemsInTable) {
        throw new Error('If in virtual select all mode, rowKeysToActOn should be empty.');
    }

    if (exclusionList.length && !isActingOnAllItemsInTable) {
        throw new Error('If not in virtual select all mode, exclusionList should be empty.');
    }

    const folderId = tableView.tableQuery.folderId;
    const folder = folderStore.folderTable.get(folderId);

    // When we are in virtual select mode, with a few rows deselected.
    const inVirtualSelectModeWithExclusion =
        tableView.isInVirtualSelectAllMode && exclusionList.length > 0;

    const viewFilter = getViewFilterForTable(tableView);

    // Determine if something is acting on all items- Mark All as read from folder ( as we work on items at the folder level)
    // and we are not in the filtered view - focused, inbox plus or view filters other than all.
    const actOnAllItemsInFolder =
        actionSource === 'ContextFolder' ||
        (isCommandingViewActionSource(actionSource) &&
            isActingOnAllItemsInTable &&
            !tableView.isInCheckedMode &&
            !isFilteredTableView(tableView, viewFilter));

    //When we are acting on only selected set of rows and are definitely not in select all mode.
    const inSelectedRowsMode = rowKeysToActOn.length > 0 && !isActingOnAllItemsInTable;

    /**
     * Calculate whether to show confirmation dialog in virtual select all mode when the
     * number of unread items exceeds threshold (currently 25 items).
     **/
    const shouldShowConfirmDialogWhenActingOnAllItems =
        isActingOnAllItemsInTable &&
        folder &&
        folder.UnreadCount >= NUMBER_OF_SELECTED_ITEMS_THRESHOLD;

    // Count the number of rows to be acted on.
    const rowsCountToActOn = getRowsCountToActOn(
        actOnAllItemsInFolder,
        inVirtualSelectModeWithExclusion,
        folder,
        exclusionList.length,
        rowKeysToActOn.length,
        tableView,
        viewFilter,
        isActingOnAllItemsInTable
    );

    // Show confirmation dialog when either above condition is true in virtual select mode or
    // we have more than the threshold number of rows to act on
    const showConfirmationDialog =
        shouldShowConfirmDialogWhenActingOnAllItems ||
        rowsCountToActOn >= NUMBER_OF_SELECTED_ITEMS_THRESHOLD;

    let confirmText = { headerText: '', bodyText: '' };
    if (showConfirmationDialog) {
        // Get display name from folder (or fall back if search results).
        const displayName = getFolderScopeText(
            tableView.tableQuery.type,
            tableView,
            folder && getEffectiveFolderDisplayName(folder)
        );

        // Determine strings for confirmation dialog and body text and include the number we will be acting on
        // depending on the conversations or items view.
        confirmText = getMarkAsReadUnreadAllConfirmText(
            actOnAllItemsInFolder,
            tableView.tableQuery.listViewType,
            rowsCountToActOn,
            displayName,
            isReadValueToSet,
            inVirtualSelectModeWithExclusion,
            inSelectedRowsMode,
            tableView.tableQuery.type === TableQueryType.Group
        );
    }

    confirm(
        confirmText.headerText,
        confirmText.bodyText,
        !showConfirmationDialog /* resolveImmediately */,
        <ConfirmCustomizationOptions>{
            // Wait until dialog is dismissed to avoid focus interruption.
            delayCallbackAfterAnimation: true,
            okText: loc(okButton),
        }
    ).then(async (response: DialogResponse) => {
        if (response === DialogResponse.ok) {
            await undoActions.clearLastUndoableAction();

            if (isActingOnAllItemsInTable) {
                const readReceiptConfiguration = getUserConfiguration().UserOptions.ReadReceipt;
                const suppressReadReceipts =
                    readReceiptConfiguration == 'DoNotAutomaticallySend' ||
                    readReceiptConfiguration == 'NeverSend' ||
                    isSharedFolder(folderId);

                // When folder is paused we shall act only on items that were delivered before the pause time
                const clientLastSyncTime = isFolderPaused(folderId)
                    ? listViewStore.inboxPausedDateTime
                    : null;

                logMarkAllAsReadUnreadDatapoint(actionSource, isReadValueToSet, tableView);

                // Tracking the mark as read operation for the diagnostics panel
                lazyAddMarkAsReadDiagnostics.import().then(addMarkAsReadDiagnostics => {
                    addMarkAsReadDiagnostics(
                        tableView.tableQuery,
                        true /* isActingOnAllItemsInTable */,
                        isReadValueToSet,
                        actionSource
                    );
                });

                let conversationIdsToExclude = [];
                if (tableView.tableQuery.listViewType === ReactListViewType.Conversation) {
                    conversationIdsToExclude = getConversationIdsFromConversations(
                        exclusionList,
                        tableView.id
                    );
                }
                let exclusionItemIds = [];
                // Convert RowKeys to ItemIds depending on whether it is a conversation or items view
                switch (tableView.tableQuery.listViewType) {
                    case ReactListViewType.Conversation:
                        exclusionItemIds = getItemIdsFromConversations(exclusionList, tableView.id);
                        break;
                    case ReactListViewType.Message:
                        exclusionItemIds = getRowIdsFromRowKeys(exclusionList, tableView.id);
                        break;
                }

                markAllAsReadStoreUpdate(tableView, isReadValueToSet, exclusionItemIds);

                let baseServerFolderId = getBaseServerFolderId(tableView);
                let baseServerFolderIdString = (baseServerFolderId as FolderId)?.Id;
                if (!baseServerFolderIdString) {
                    baseServerFolderIdString = (baseServerFolderId as DistinguishedFolderId)?.Id;
                }

                const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
                let input: MarkViewAsReadMutationVariables = {
                    id: baseServerFolderIdString,
                    focusedViewFilter: getGqlFocusedViewFilterFromOwsFocusedViewFilter(
                        mailTableQuery.focusedViewFilter
                    ),
                    viewFilter: getGqlViewFilterFromOwsViewFilter(mailTableQuery.viewFilter),
                    markAsRead: isReadValueToSet,
                    clientLastSyncTime: clientLastSyncTime && getISOString(clientLastSyncTime),
                    conversationIdsToExclude: conversationIdsToExclude,
                    itemIdsToExclude: exclusionItemIds,
                    suppressReadReceipt: suppressReadReceipts,
                    mailboxInfo: getMailboxInfo(tableView),
                };

                exportedHelperFunctions.invokeMarkViewAsReadMutation(input);
            } else {
                switch (tableView.tableQuery.listViewType) {
                    case ReactListViewType.Conversation:
                        markConversationsAsReadFromTable(
                            rowKeysToActOn,
                            tableView,
                            isReadValueToSet,
                            actionSource
                        );
                        break;

                    case ReactListViewType.Message:
                        markItemsAsReadFromTable(
                            rowKeysToActOn,
                            tableView,
                            isReadValueToSet,
                            true /* isExplicit */,
                            actionSource
                        );
                        break;
                }
            }
        }
    });
});

/**
 * Invoke the MarkViewAsRead mutation
 * @param input input parameters for the mutation
 */
const invokeMarkViewAsReadMutationFn = async function invokeMarkViewAsReadMutation(
    input: MarkViewAsReadMutationVariables
): Promise<MarkViewAsReadResult> {
    const client = getApolloClient();
    const result = await client.mutate({
        variables: input,
        mutation: MarkViewAsReadDocument,
    });

    return result?.data?.markViewAsRead;
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeMarkViewAsReadMutation: invokeMarkViewAsReadMutationFn,
};

function logMarkAllAsReadUnreadDatapoint(
    actionSource: ActionSource,
    isReadValueToSet: boolean,
    tableView: TableView
) {
    let name = 'TnS_MarkAllAs';
    name += isReadValueToSet ? 'Read' : 'Unread';
    logUsage(name, [actionSource, getFocusedFilterForTable(tableView), tableView.isInCheckedMode]);
}

function getRowsCountToActOn(
    actOnAllItemsInFolder: boolean,
    inVirtualSelectModeWithExclusion: boolean,
    folder: any,
    exclusionListCount: number,
    selectedRowsCount: number,
    tableView: TableView,
    viewFilter: ViewFilter,
    isActingOnAllItemsInTable: boolean
): number {
    // If we are choosing from folder by right clicking and Mark all as read from right click on folder, we return the folder unread count,
    // we can get the unread count, only when in the folder context.
    // We are adding an extra case for category favorite folder where the unread count is returned.
    if (actOnAllItemsInFolder) {
        const categoryName = getUserCategoryName(tableView);
        if (categoryName) {
            return getCategoryUnreadCount(categoryName);
        }
        return folder?.UnreadCount;
    }

    // Special case here for filtered views where if we are in checked mode or virtual select or everything is selected
    // in the table or acting on everything, we return the total rows in view , else we return the selected rows.
    // For other cases, if we are selecting everything in the table, we are in either virtual select all mode or
    // select all mode with exclusion we will return all selected rows minus the exclusion list.
    if (
        getIsEverythingSelectedInTable(tableView) ||
        inVirtualSelectModeWithExclusion ||
        (isFilteredTableView(tableView, viewFilter) && isActingOnAllItemsInTable)
    ) {
        return tableView.totalRowsInView - exclusionListCount;
    }

    // else we just return the selected rows count in the table.
    return selectedRowsCount;
}
