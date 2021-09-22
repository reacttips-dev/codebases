import shouldPrefetchModel from './shouldPrefetchModel';
import type { ClientItemId } from 'owa-client-ids';
import { MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import type { LoadConversationItemActionSource } from 'owa-mail-store';
import { lazyLoadConversation, lazyLoadItem } from 'owa-mail-store-actions';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import prefetch from 'owa-service/lib/prefetch';
import { isPrefetchDisabled } from './isPrefetchDisabled';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

/**
 * Issues load conversation to make a service call for fetching this item
 * @param - rowKey - rowKey of the row that needs to be prefetched, currently only conversation rows supported
 * @param - tableView - tableView to which the item belongs
 * @param - updateOnlyIfModelExistsInCache - Flag indicating to update the row only if it is cached to get latest data for it
 * @param - actionSource - the load conversation/item action source
 */
export default function prefetchRow(
    rowKey: string,
    tableView: TableView,
    updateOnlyIfModelExistsInCache: boolean,
    actionSource: LoadConversationItemActionSource
) {
    if (isPrefetchDisabled()) {
        return;
    }

    // When prefetching a row, check if it still exists in the table
    const rowIndex = tableView.rowKeys.indexOf(rowKey);
    if (rowIndex < 0 || rowIndex > tableView.currentLoadedIndex) {
        return;
    }

    // For unstacked view, use message type if not adding or updating row (actionSource is PrefetchSingleRow)
    let listViewType, rowId;
    if (actionSource !== 'PrefetchSingleRow' && shouldShowUnstackedReadingPane()) {
        listViewType = ReactListViewType.Message;
        rowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView);
    } else {
        listViewType = tableView.tableQuery.listViewType;
        rowId = MailRowDataPropertyGetter.getRowClientItemId(rowKey, tableView);
    }

    prefetchRowBasedOnRowId(rowId, updateOnlyIfModelExistsInCache, actionSource, listViewType);
}

/**
 * Issues load row to make a service call for fetching the full row data
 * @param - rowKey - rowKey to prefetch
 * @param - updateOnlyIfModelExistsInCache - Flag indicating to update the row only if it is cached to get latest data for it
 * @param - actionSource - the load conversation/item action source
 * @param - listViewType
 */
export function prefetchRowBasedOnRowId(
    rowId: ClientItemId,
    updateOnlyIfModelExistsInCache: boolean,
    actionSource: LoadConversationItemActionSource,
    listViewType: ReactListViewType
) {
    if (isPrefetchDisabled() || !rowId) {
        return;
    }

    // Skip this check for addOrUpdateRow in unstacked view because we prefetch items, and when updating row, we need
    // conversation data which may or may not be present in cache.
    if (
        !(actionSource === 'PrefetchSingleRow' && shouldShowUnstackedReadingPane()) &&
        !shouldPrefetchModel(rowId.Id, listViewType, updateOnlyIfModelExistsInCache)
    ) {
        return;
    }

    let lazyAction;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            lazyAction = lazyLoadConversation;
            break;
        case ReactListViewType.Message:
            lazyAction = lazyLoadItem;
            break;
    }

    if (lazyAction) {
        lazyAction.import().then(action => {
            // the prefetch only works if the service action is called within synchronous execution.
            // So we are calling after the import to ensure this happens
            prefetch(() => {
                listViewType == ReactListViewType.Conversation
                    ? action(rowId, actionSource)
                    : action(
                          rowId,
                          actionSource,
                          null /*topActionDatapoint*/,
                          false /*enableSmimeHeader*/,
                          false /*isDiscovery*/,
                          shouldShowUnstackedReadingPane() ? 'UnstackedReadingPane' : null
                      );
            });
        });
    }
}
