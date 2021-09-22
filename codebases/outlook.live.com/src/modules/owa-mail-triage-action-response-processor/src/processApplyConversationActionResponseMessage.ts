import type { TableView } from 'owa-mail-list-store';
import onTriageActionCompleted from './onTriageActionCompleted';
import onTriageActionFailed from './onTriageActionFailed';
import handleServerResponseSuccessAndError from 'owa-service-utils/lib/handleServerResponseSuccessAndError';
import { returnTopExecutingActionDatapoint } from 'owa-analytics';

/**
 * Processes the applyConversationActionResponse message
 * Regardless of success or failure we shall remove the rows from tombstone
 * Upon failure we should reload the table to be in a consistent state with the server
 * @param applyConversationActionPromise promise to process
 * @param rowKeys rowKeys on which the action was taken
 * @param sourceFolderId folder id to which the rows belonged
 * @param tableView table view to which the rows belonged
 * @param shouldRemoveRowsFromTombstone flag indicating whether to remove the rows from tombstone map after the response from server is received
 * @param skipCheckingResponseMessage for GQL responses, we don't need to check the response because GQL will throw on failure
 */
export default function processApplyConversationActionResponseMessage(
    applyConversationActionPromise: Promise<any>,
    rowKeys: string[],
    sourceFolderId: string,
    tableView: TableView,
    shouldRemoveRowsFromTombstone: boolean,
    skipCheckingResponseMessage?: boolean
): Promise<void> {
    const dp = returnTopExecutingActionDatapoint();
    return applyConversationActionPromise
        .then(response => {
            if (dp) {
                dp.addCheckpoint('PAPCARM');
            }
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            return skipCheckingResponseMessage
                ? void 0
                : handleServerResponseSuccessAndError(response);
        })
        .catch(error => {
            onTriageActionCompleted(rowKeys, sourceFolderId, shouldRemoveRowsFromTombstone);
            onTriageActionFailed(tableView);
            return Promise.reject(error);
        });
}
