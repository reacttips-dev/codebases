import getSpotlightItemByRowKey from '../selectors/getSpotlightItemByRowKey';
import getStore from '../store/store';
import { addItemsToSpotlightItemsCache, SpotlightCacheType } from '../utils/cacheUtils';
import { logUsage } from 'owa-analytics';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import { getDefaultInboxTableView } from 'owa-mail-triage-table-utils/lib/getDefaultInboxTableView';
import { lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { orchestrator } from 'satcheljs';
import {
    MailFolderTableQuery,
    getSelectedTableView,
    isConversationView,
} from 'owa-mail-list-store';
import onSpotlightDismissedFromRP, {
    onSpotlightDismissedFromRPProcessed,
} from '../actions/onSpotlightDismissedFromRP';

orchestrator(onSpotlightDismissedFromRP, actionMessage => {
    const { rowKey } = actionMessage;

    // Add dismissed item to the cache of dismissed items (for future page loads)
    addItemsToSpotlightItemsCache(SpotlightCacheType.Dismissed, [
        {
            rowKey,
        },
    ]);

    const { conversationId, itemId, referenceId } = getSpotlightItemByRowKey(rowKey);

    // Send dismissal event to 3S.
    const sessionSettings = getUserConfiguration().SessionSettings;
    lazyLogSearchEntityActions.importAndExecute(
        SubstrateSearchScenario.ContextualInsights,
        sessionSettings.UserPuid,
        sessionSettings.ExternalDirectoryTenantGuid,
        getStore().logicalId,
        null /* traceId */,
        referenceId,
        'SpotlightDismissed'
    );

    // Log client data point
    const selectedTableView = getSelectedTableView();
    if (selectedTableView) {
        logUsage('Spotlight_ItemDismissed', {
            isImportantFilter:
                (selectedTableView.tableQuery as MailFolderTableQuery).scenarioType === 'spotlight',
            conversationId: isConversationView(selectedTableView) ? conversationId : null,
            itemId: !isConversationView(selectedTableView) ? itemId : null,
        });
    }

    // Remove the dismissed row from the table in the store.
    removeRowFromView(rowKey, getDefaultInboxTableView().tableQuery as MailFolderTableQuery);

    // Dispatch processed action since item can safely be removed from store.
    onSpotlightDismissedFromRPProcessed(rowKey);
});

const removeRowFromView = (rowKey: string, tableQuery: MailFolderTableQuery) => {
    const modifiedTableQuery = { ...tableQuery, scenarioType: 'spotlight' };

    // Remove row from the view.
    removeRowsFromListViewStore(
        [rowKey],
        getTableViewFromTableQuery(modifiedTableQuery),
        'Spotlight',
        false /* shouldRemoveFromAllTables */
    );
};
