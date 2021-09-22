import { TableView, getViewFilterForTable } from '../index';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';

/**
 * Determines whether the given table supports auto mark as read
 * @param tableView tableView
 * @returns true if the table is unread and supports auto mar as read.
 */
export default function doesTableSupportAutoMarkRead(tableView: TableView) {
    // All tables that are not filtered by unread support auto mark as read
    if (getViewFilterForTable(tableView) !== 'Unread') {
        return true;
    }

    // when filtered by unread auto read is supported only if setting is enabled.
    return (
        isFeatureEnabled('tri-autoMarkReadInUnreadSetting') &&
        getIsBitSet(ListViewBitFlagsMasks.ShouldAutoReadInUnreadFilter)
    );
}
