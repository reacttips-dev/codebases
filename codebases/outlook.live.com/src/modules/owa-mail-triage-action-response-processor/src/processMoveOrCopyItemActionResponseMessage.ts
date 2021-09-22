import onTriageActionCompleted from './onTriageActionCompleted';
import onTriageActionFailed from './onTriageActionFailed';
import type { TableView } from 'owa-mail-list-store';
import type CopyItemResponse from 'owa-service/lib/contract/CopyItemResponse';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type MoveItemResponse from 'owa-service/lib/contract/MoveItemResponse';
import type { TraceErrorObject } from 'owa-trace';
import { MoveItemResult } from 'owa-graph-schema';

/**
 * Processes the CopyItem action
 * Upon failure we should reload the table to be in a consistent state with the server
 * TODO: This will be removed once we move copyItem to gql as well.WI- 120560
 * @param updateItemActionPromise promise to process
 * @param rowKeys rowKeys on which the action was taken
 * @param sourceFolderId folder id to which the rows belonged
 * @param tableView table view to which the rows belonged
 * @param shouldRemoveRowsFromTombstone flag indicating whether to remove the rows from tombstone map after the response from server is received
 */
export default function processCopyItemActionResponseMessage(
    updateItemActionPromise: Promise<MoveItemResponse> | Promise<CopyItemResponse>,
    rowKeys: string[],
    sourceFolderId: string,
    tableView: TableView,
    shouldRemoveRowsFromTombstone: boolean
): Promise<void> {
    return updateItemActionPromise
        .then(response => {
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            if (response.ResponseMessages) {
                const responseItems = <ItemInfoResponseMessage[]>response.ResponseMessages.Items;
                const error = getErrorsInResponse(responseItems, tableView);
                return error ? Promise.reject(error) : Promise.resolve();
            }

            return Promise.reject(new Error('processCopyItemActionResponseMessage empty response'));
        })
        .catch(error => {
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            onTriageActionFailed(tableView);
            return Promise.reject(error);
        });
}

/**
 * Processes the MoveItem and CopyItem action
 * Upon failure we should reload the table to be in a consistent state with the server
 * @param updateItemActionPromise promise to process
 * @param rowKeys rowKeys on which the action was taken
 * @param sourceFolderId folder id to which the rows belonged
 * @param tableView table view to which the rows belonged
 * @param shouldRemoveRowsFromTombstone flag indicating whether to remove the rows from tombstone map after the response from server is received
 */
export function processMoveItemActionResponseMessage(
    moveItemActionPromise: Promise<MoveItemResult>,
    rowKeys: string[],
    sourceFolderId: string,
    tableView: TableView,
    shouldRemoveRowsFromTombstone: boolean
): Promise<void> {
    let errors: boolean = false;
    return moveItemActionPromise
        .then(response => {
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            if (response.success) {
                response.movedItemIdsResults.forEach(function (item) {
                    if (item.successForMovedItems) {
                        //success
                        errors = false;
                        return Promise.resolve();
                    } else {
                        onTriageActionFailed(tableView);
                        const error: TraceErrorObject = new Error('Error happened in moving items');
                        error.fetchErrorType = 'ServerFailure';
                        errors = true;
                        return Promise.reject(error);
                    }
                });
            }

            if (!errors) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('processMoveItemActionResponseMessage empty response'));
        })
        .catch(error => {
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            onTriageActionFailed(tableView);
            return Promise.reject(error);
        });
}

/**
 * This method checks for errors on the responseItems passed in, and returns an Error object if error was found
 * @param responseItems - ItemInfoResponseMessage
 * @param originalTableView - table view of the source folder
 */
export function getErrorsInResponse(
    responseItems: ItemInfoResponseMessage[],
    originalTableView: TableView
): Error {
    for (const responseItem of responseItems) {
        if (responseItem && responseItem.ResponseClass != 'Success') {
            onTriageActionFailed(originalTableView);
            const error: TraceErrorObject = new Error(
                `ResponseCode=${responseItem.ResponseCode}, Stacktrace=${responseItem.StackTrace}`
            );
            error.fetchErrorType = 'ServerFailure';
            return error;
        }
    }

    return null;
}
