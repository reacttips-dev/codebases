import { mutator } from 'satcheljs';
import updateLastIndexToRender from '../utils/updateLastIndexToRender';
import { listViewStore, MailRowDataPropertyGetter, TableQueryType } from 'owa-mail-list-store';
import { getMinimumRowHeight } from 'owa-mail-layout';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { isFeatureEnabled } from 'owa-feature-flags';

// Calculate the last index to render on initial table load (before any scrolling)
// Each index is counted by calculating a running total of the minimum possible height of each
// row until it is the same height as the window, plus some buffer
mutator(updateLastIndexToRender, actionMessage => {
    const { rowKeys, tableView } = actionMessage;

    const maxHeightToFill = window.innerHeight * 1.5;
    const tableSupportsPinning = shouldTableSortByRenewTime(tableView.tableQuery);
    const showCondensedPinnedRows =
        tableView.tableQuery.type === TableQueryType.Folder && tableSupportsPinning;

    let currentHeight = 0;
    for (let i = 0; i < rowKeys.length; ++i) {
        if (currentHeight < maxHeightToFill) {
            const isPinned = MailRowDataPropertyGetter.getIsPinned(rowKeys[i], tableView);
            const isCondensedRow =
                !isFeatureEnabled('mon-tri-readPinnedItems') && showCondensedPinnedRows && isPinned;
            currentHeight += getMinimumRowHeight(isCondensedRow);
        } else {
            listViewStore.lastIndexToRender = i;
            break;
        }

        // If all rows fit in view, still update lastIndexToRender
        if (i === rowKeys.length - 1) {
            listViewStore.lastIndexToRender = i;
        }
    }
});
