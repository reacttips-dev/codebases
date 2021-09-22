import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';
import { trace } from 'owa-trace';
import {
    getSelectedTableView,
    MailRowDataPropertyGetter,
    TableQueryType,
    TableView,
    isFolderPaused,
} from 'owa-mail-list-store';

/**
 * This function determines if we should show any rollup at the top of the
 * mail list. This is shared logic between all of our rollup types.
 */
export default function shouldShowRollup(
    previousRowKey: string,
    currentRowKey: string,
    folderId: string
): boolean {
    if (!currentRowKey) {
        trace.warn('shouldShowRollup: currentRowId is not expected to be null');
        return false;
    }

    // Don't show rollups when inbox is paused.
    if (isFolderPaused(folderId)) {
        return false;
    }

    // Don't show rollups in non-folder tables.
    const tableView = getSelectedTableView();
    const isFolderTable = tableView.tableQuery.type === TableQueryType.Folder;
    if (!isFolderTable) {
        return false;
    }

    // Don't show rollups in pinned items or nudged sections.
    if (isPinnedOrNudged(currentRowKey, tableView)) {
        return false;
    }

    /**
     * Otherwise, when the current row is not pinned, show rollup on top of list
     * view if current row is the first row, or if the previous row is pinned or
     * nudged.
     */
    return previousRowKey === null || isPinnedOrNudged(previousRowKey, tableView);
}

function isPinnedOrNudged(rowKey: string, tableView: TableView): boolean {
    return (
        MailRowDataPropertyGetter.getIsPinned(rowKey, tableView) ||
        doesRowBelongToNudgeSection(
            rowKey,
            tableView.id,
            MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
        )
    );
}
