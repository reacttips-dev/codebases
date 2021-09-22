import { selectFocusedViewFilter } from 'owa-mail-triage-table-utils';
import { getFocusedFilterForTable, getSelectedTableView } from 'owa-mail-list-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';

/**
 * Called when F/O rollup is clicked
 */
export default function onFocusedOtherRollupClicked() {
    // - Switch to target Focused or Other pivot
    const targetPivotToSwitchTo =
        getFocusedFilterForTable(getSelectedTableView()) == FocusedViewFilter.Focused
            ? FocusedViewFilter.Other
            : FocusedViewFilter.Focused;
    selectFocusedViewFilter(targetPivotToSwitchTo, 'FocusedOtherRollup');
}
