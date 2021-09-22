import markItemsAsReadBasedOnItemIds from '../helpers/markItemsAsReadBasedOnItemIds';
import autoMarkForkAsRead from '../helpers/autoMarkForkAsRead';
import * as suppressedItemIdsMapOperations from '../helpers/suppressedItemIdsMapOperations';
import { doesTableSupportAutoMarkRead, TableView } from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import selectMailStoreItemById from 'owa-mail-store/lib/selectors/selectMailStoreItemById';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';

/**
 * Try perform auto mark as read on item
 * @param itemId the item id to be auto marked as read
 * @param tableView the table view
 * @param rowKey the row key
 */
export default action('autoMarkItemAsRead')(async function autoMarkItemAsRead(
    itemId: string,
    tableView: TableView,
    rowKey?: string
) {
    // No-op if tableView does not support auto mark as read
    if (!doesTableSupportAutoMarkRead(tableView)) {
        return;
    }

    // Do not perform auto mark as read if item is in suppressed map
    if (suppressedItemIdsMapOperations.contains([itemId])) {
        return;
    }

    const item = selectMailStoreItemById(itemId);
    let isListViewMessageType: boolean;
    if (item) {
        const listViewType = getListViewTypeForFolder(item.ParentFolderId.Id);
        isListViewMessageType = listViewType == ReactListViewType.Message;
    }

    // Some folders like draft, junk are treated as item view. Therefore no concept of forks.
    if (shouldShowUnstackedReadingPane() && !isListViewMessageType) {
        autoMarkForkAsRead(tableView, itemId, rowKey, true /* isReadValueToSet */);
    } else {
        await markItemsAsReadBasedOnItemIds(
            tableView,
            [itemId],
            true /* isReadValueToSet */,
            false /* isExplicit */,
            null /* actionSource */,
            [] /* instrumentationContexts */
        );
    }

    // Clear the suppressed itemIds map
    suppressedItemIdsMapOperations.clear();
});
