import {
    singleSelectRow,
    selectNewItemUponRowRemoval,
} from 'owa-mail-actions/lib/mailListSelectionActions';
import { MailRowDataPropertyGetter } from 'owa-mail-list-store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isReadingPanePositionOff, shouldShowReadingPane } from 'owa-mail-layout';
import { orchestrator } from 'satcheljs';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';

function getEffectiveNextSelection(): string {
    // If user has selected "ReturnToView" ensure it is compatible with layout
    // Else return user's NextSelection
    const userConfig = getUserConfiguration().UserOptions;
    if (userConfig.NextSelection == 'ReturnToView' && !isReadingPanePositionOff()) {
        return 'Next';
    }
    return userConfig.NextSelection;
}

function getRowIndexToSelect(
    lastSelectedRowIndex: number,
    selectionDirection: string,
    tableViewLength: number
): number {
    let indexToSelect = lastSelectedRowIndex;
    if (selectionDirection == 'Previous') {
        indexToSelect--;
    }

    // If the selection index ends up out of bounds, reset it to
    // either the top or the bottom of the list
    if (indexToSelect < 0) {
        indexToSelect = 0;
    } else if (indexToSelect > tableViewLength - 1) {
        indexToSelect = tableViewLength - 1;
    }

    return indexToSelect;
}

export default orchestrator(selectNewItemUponRowRemoval, actionMessage => {
    const { tableView, lastSelectedRowIndex, lastSelectedRowWasPinned } = actionMessage;
    const tableViewLength = tableView.rowKeys.length;

    // Nothing to do if the table is empty
    if (tableViewLength == 0) {
        return;
    }

    const showReadingPane = shouldShowReadingPane();
    let selectionSource = MailListItemSelectionSource.RowRemoval;
    const selectionDirection = getEffectiveNextSelection();

    // Get the index of the item to select
    let indexToSelect = getRowIndexToSelect(
        lastSelectedRowIndex,
        selectionDirection,
        tableViewLength
    );

    // When the user's setting is set to select 'previous' and  the top
    // non-pinned item was deleted, we should not select the last pinned/nudged item
    // automatically. We should instead fallback to 'next' behavior so the top
    // non-pinned/non-nudged item gets selected again. Note that if the user is already in
    // the pinned/nudged section we will maintain the existing behavior (and select
    // previous item)
    if (selectionDirection == 'Previous') {
        const rowKeyToSelect = tableView.rowKeys[indexToSelect];
        const wouldEnterPinnedOrNudgeSection =
            (doesRowBelongToNudgeSection(
                rowKeyToSelect,
                tableView.id,
                MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKeyToSelect, tableView)
            ) ||
                MailRowDataPropertyGetter.getIsPinned(rowKeyToSelect, tableView)) &&
            !lastSelectedRowWasPinned;

        if (wouldEnterPinnedOrNudgeSection) {
            indexToSelect = getRowIndexToSelect(lastSelectedRowIndex, 'Next', tableViewLength);
        }
    }

    const rowKey = tableView.rowKeys[indexToSelect];

    // if we are in single line view and remove an item while the reading pane is open, we want to automatically open the prev/next item
    if (isReadingPanePositionOff() && showReadingPane) {
        selectionSource = MailListItemSelectionSource.ImmersiveReadingPaneDelete;
    }

    singleSelectRow(tableView, rowKey, false /* isUserNavigation */, selectionSource);
});
