import tryRemoveFromMailStoreItems, {
    RemoveItemSource,
} from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { getRowIdsFromRowKeys, getTableToRowRelationKey, listViewStore } from 'owa-mail-list-store';
import { lazyRemoveMeetingMessagesFromStore } from 'owa-listview-rsvp';
import { lazyRemoveTxpFromStoreAction } from 'owa-listview-txp';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function removeItemData(rowKey: string, tableView: TableView) {
    // For a single row key, it should never map to multiple item ids
    const messageItemId = getRowIdsFromRowKeys([rowKey], tableView.id)[0];

    // 1. Remove table item relation
    const tableItemRelationKey = getTableToRowRelationKey(rowKey, tableView.id);
    if (!listViewStore.tableViewItemRelations.has(tableItemRelationKey)) {
        throw new Error('Item not found in list view store');
    }

    listViewStore.tableViewItemRelations.delete(tableItemRelationKey);

    lazyRemoveMeetingMessagesFromStore.importAndExecute([messageItemId]);

    if (isFeatureEnabled('tri-txpButtonInLV')) {
        lazyRemoveTxpFromStoreAction.importAndExecute([messageItemId]);
    }

    // Try removing it if the ref is not held by other scenarios
    tryRemoveFromMailStoreItems(messageItemId, RemoveItemSource.ListViewTable);
}
