import markItemsAsReadBasedOnItemIds from '../../helpers/markItemsAsReadBasedOnItemIds';
import {
    getRowIdsFromRowKeys,
    TableView,
    getContextFolderIdForTable,
    shouldRemoveRowOnMarkReadAction,
} from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { action } from 'satcheljs/lib/legacy';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import {
    onTriageActionCompleted,
    onTriageActionFailed,
} from 'owa-mail-triage-action-response-processor';

/**
 * Mark the given items read from the table
 * @param rowKeys of the rows to be marked as read/unread
 * @param tableView the table view
 * @param isReadValueToSet the isRead value to be set
 * @param isExplicit whether the mark as read action is triggered explicitly from user, i.e. not from auto mark as read scenarios
 * @param actionSource the action source which triggers the action
 */
export default action('markItemsReadFromTable')(function markItemsReadFromTable(
    rowKeys: string[],
    tableView: TableView,
    isReadValue: boolean,
    isExplicit: boolean,
    actionSource: ActionSource
) {
    const itemIdStrings = getRowIdsFromRowKeys(rowKeys, tableView.id);
    const instrumentationContexts = getInstrumentationContextsFromTableView(rowKeys, tableView);
    const markItemAsReadPromise = markItemsAsReadBasedOnItemIds(
        tableView,
        itemIdStrings,
        isReadValue,
        isExplicit,
        actionSource,
        instrumentationContexts
    );

    const contextFolderId = getContextFolderIdForTable(tableView);

    const shouldRemoveRowsFromTombstone = shouldRemoveRowOnMarkReadAction(
        tableView,
        isReadValue,
        isExplicit
    );

    markItemAsReadPromise
        .then(response => {
            onTriageActionCompleted(rowKeys, contextFolderId, shouldRemoveRowsFromTombstone);
        })
        .catch(error => {
            onTriageActionCompleted(rowKeys, contextFolderId, shouldRemoveRowsFromTombstone);
            onTriageActionFailed(tableView);
        });
});
