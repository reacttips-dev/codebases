import createMailFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailFolderTableQuery';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { updateWatermarksAndResetRollup } from 'owa-mail-focused-inbox-rollup-store';
import { loadTableViewFromTableQuery } from '../index';
import { orchestrator } from 'satcheljs';
import { selectFocusedViewFilter } from 'owa-mail-triage-table-utils';
import { lazyResetFocus } from 'owa-mail-focus-manager';

orchestrator(selectFocusedViewFilter, async actionMessage => {
    const focusedViewFilterToSelect = actionMessage.focusedViewFilter;
    const selectedTableView = getSelectedTableView();

    // Update last visit watermark for selected pivot and reset rollup data
    updateWatermarksAndResetRollup(focusedViewFilterToSelect, 'NonUserAction');

    // Always reset the view filter when user switches the focused pivot
    const tableQuery = createMailFolderTableQuery(
        selectedTableView.tableQuery.folderId,
        selectedTableView.tableQuery.listViewType,
        'mail',
        focusedViewFilterToSelect,
        null /* viewFilter */,
        null /* categoryName */,
        null /* sortBy */
    );

    const loadTableViewPromise = await loadTableViewFromTableQuery(tableQuery);
    lazyResetFocus.importAndExecute();

    return loadTableViewPromise;
});
