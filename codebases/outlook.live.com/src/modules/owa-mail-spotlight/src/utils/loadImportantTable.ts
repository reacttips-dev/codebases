import { getSpotlightItemsCache, SpotlightCacheType } from './cacheUtils';
import onSpotlightFilterLoaded from '../actions/onSpotlightFilterLoaded';
import getStore from '../store/store';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';

export default function loadImportantTable(actionSource: string) {
    /**
     * Remove any items that have been dismissed (i.e. a strong action was taken
     * on them) during the session so they don't appear in the Spotlight filter.
     */
    removeDismissedSpotlightItemsFromView();
    onSpotlightFilterLoaded(actionSource);
}

const removeDismissedSpotlightItemsFromView = () => {
    const { spotlightTableQuery } = getStore();

    /**
     * If spotlightTableQuery doesn't exist, then the Spotlight table view isn't
     * populated yet which means there's no rows to remove so we can return.
     */
    if (!spotlightTableQuery) {
        return;
    }

    const spotlightTableView = getTableViewFromTableQuery(spotlightTableQuery);

    // Get dismissed Spotlight items' row keys if they're still in the inbox.
    const dismissedSpotlightItems = getSpotlightItemsCache(SpotlightCacheType.Dismissed);
    const dismissedSpotlightItemRowKeys = dismissedSpotlightItems
        .map(spotlightItem => spotlightItem.rowKey)
        .filter(rowKey => spotlightTableView.rowKeys.includes(rowKey));

    /**
     * If we have dismissed Spotlight items that are still in the Spotlight table
     * view, remove them from the table view so the view is up-to-date with the
     * current state of Spotlight items.
     */
    if (dismissedSpotlightItemRowKeys.length > 0) {
        removeRowsFromListViewStore(
            dismissedSpotlightItemRowKeys,
            spotlightTableView,
            'Spotlight',
            false
        );
    }
};
