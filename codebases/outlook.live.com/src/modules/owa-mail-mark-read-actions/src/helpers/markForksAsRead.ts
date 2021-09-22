import { lazyAddMarkAsReadDiagnostics } from 'owa-group-readunread-diagnostics';
import { TableView, shouldRemoveRowOnMarkReadAction } from 'owa-mail-list-store';
import getContextFolderIdForTable from 'owa-mail-list-store/lib/utils/getContextFolderIdForTable';

import type { ActionSource } from 'owa-analytics-types';
import { processApplyConversationActionResponseMessage } from 'owa-mail-triage-action-response-processor';
import type { ConversationFork, ConversationForkInput } from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import {
    MarkForkAsReadDocument,
    MarkForkAsReadMutation,
} from '../graphql/__generated__/markForkAsReadMutation.interface';

type MarkForkAsReadResult = MarkForkAsReadMutation['markForkAsRead'];

export default function markForksAsRead(
    forks: ConversationFork[],
    tableView: TableView,
    isReadValue: boolean,
    isExplicit: boolean,
    actionSource: ActionSource
): Promise<void> {
    // Tracking the mark as read operation for the diagnostics panel
    lazyAddMarkAsReadDiagnostics.import().then(addMarkAsReadDiagnostics => {
        addMarkAsReadDiagnostics(
            tableView.tableQuery,
            false /* isActingOnAllItemsInTable */,
            isReadValue,
            actionSource,
            forks.map(fork => fork.id)
        );
    });

    return performForkLevelMarkReadOperation(tableView, forks, isReadValue, isExplicit);
}

function performForkLevelMarkReadOperation(
    tableView: TableView,
    forks: ConversationFork[],
    isReadValue: boolean,
    isExplicit: boolean
) {
    const contextFolderId = getContextFolderIdForTable(tableView);

    const markConversationsAsReadPromise = exportedHelperFunctions.invokeMarkForkAsReadMutation(
        forks,
        isReadValue,
        isExplicit
    );

    const shouldRemoveRowsFromTombstone = shouldRemoveRowOnMarkReadAction(
        tableView,
        isReadValue,
        isExplicit
    );

    return processApplyConversationActionResponseMessage(
        markConversationsAsReadPromise,
        forks.map(fork => fork.id),
        contextFolderId,
        tableView,
        shouldRemoveRowsFromTombstone,
        true // skipCheckingResponseMessage
    );
}

const invokeMarkForkAsReadMutationFn = async function invokeMarkForkAsReadMutation(
    forks: ConversationFork[],
    isReadValue: boolean,
    isUserInitiated: boolean
): Promise<MarkForkAsReadResult> {
    const client = getApolloClient();
    const result = await client.mutate({
        variables: {
            forks: forks.map(fork => {
                return <ConversationForkInput>{
                    id: fork.id,
                    forkId: fork.forkId,
                    ancestorIds: fork.ancestorIds,
                };
            }),
            isRead: isReadValue,
            isUserInitiated: isUserInitiated,
        },
        mutation: MarkForkAsReadDocument,
    });

    return result?.data?.markForkAsRead;
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeMarkForkAsReadMutation: invokeMarkForkAsReadMutationFn,
};
