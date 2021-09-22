import { isFeatureEnabled } from 'owa-feature-flags';
import { isGroupTableQuery } from 'owa-group-utils';
import isTxpEntitySupportedInListView from './isTxpEntitySupportedInListView';
import { getStore as getListViewStore, TableView } from 'owa-mail-list-store';
import { lazyAddTxpToFetchList } from '../index';

/**
 * Determines whether to add the conversation/item to the fetch list and returns a flag
 * indicating whether to show the TXP button or not
 * @param entityNamesMap EntityNamesMap property value
 * @param instanceKey instance key of item or conversation
 * @param itemId item id
 * @param tableView The Table view
 * @return shouldShowTxp flag
 */
export default function getShouldShowTxpForRowAndPrepareTxpItem(
    entityNamesMap: number,
    instanceKey: string,
    itemId: string,
    tableView: TableView
): boolean {
    if (
        entityNamesMap > 0 &&
        isFeatureEnabled('tri-txpButtonInLV') &&
        !isGroupTableQuery(tableView.tableQuery) &&
        isTxpEntitySupportedInListView(entityNamesMap)
    ) {
        // Do all work needed in order to show the TXP action button
        // i.e. Fetch item with required properties
        const cachedItem = getListViewStore().txpActionButtonData.get(itemId);
        // We add to the map
        if (!cachedItem) {
            lazyAddTxpToFetchList.importAndExecute(tableView, instanceKey, itemId);
        }
        return true;
    }

    return false;
}
