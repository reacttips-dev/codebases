import { focusedInboxRollupStore } from 'owa-mail-focused-inbox-rollup-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { getFocusedFilterForTable, getSelectedTableView } from 'owa-mail-list-store';

/**
 * Determines whether to show Focused/Other rollup in mail list.
 */
export default function shouldShowFocusedRollup(): boolean {
    if (!focusedInboxRollupStore.uniqueSenders) {
        return false;
    }

    const tableView = getSelectedTableView();

    // Don't show F/O roll up in case of FocusedViewFilter.None.
    if (getFocusedFilterForTable(tableView) === FocusedViewFilter.None) {
        return false;
    }

    return true;
}
