import setFocusedRowKey from './mutators/setFocusedRowKey';
import setMultiSelectionAnchorRowKey from './mutators/setMultiSelectionAnchorRowKey';
import setSelectionAnchorRowKey from './mutators/setSelectionAnchorRowKey';
import resetSelectionInternal from './resetSelectionInternal';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import { isReadingPanePositionOff } from 'owa-mail-layout';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import { lazyOnSingleSelectionChanged } from 'owa-mail-mark-read-actions';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { lazyOpenTableRowInPopout } from 'owa-popout-utils';
import { action } from 'satcheljs/lib/legacy';
import { lazyPreparePopoutDataForReadingPane } from 'owa-mail-folder-common';
import {
    addCustomDataToSelectMailItemDatapoint,
    endSelectMailItemDatapoint,
} from '../utils/selectMailItemDatapointUtils';

// Bug 32656: In an orchestrator, the render is triggered several times
// Due to this bug, ReadingPane.render() is triggered several times inside this method.
// To solve the reading pane perf issue, wrap this function as an action.
// When the bug is resolve, please remove the action wrapper.

/**
 * Single select mail row
 * @param tableView where the operation is being performed
 * @param rowKey the rowKey of the item to select
 * @param isUserNavigation whether user's click or action triggered this action
 * @param mailListItemSelectionSource The source of selection on mail item
 */
export default action('singleSelectRowInternal')(function singleSelectRowInternal(
    tableView: TableView,
    rowKey: string,
    isUserNavigation: boolean,
    mailListItemSelectionSource: MailListItemSelectionSource
) {
    // Open popout if user is double clicking item or using the popout shortcut regardless of selection state
    if (
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemBodyDoubleClick ||
        mailListItemSelectionSource === MailListItemSelectionSource.KeyboardShiftEnter
    ) {
        const rowKey = [...tableView.selectedRowKeys.keys()][0];
        const instrumentationContext = getInstrumentationContextsFromTableView(
            [rowKey],
            tableView
        )[0];
        lazyOpenTableRowInPopout.importAndExecute(
            tableView.tableQuery.listViewType,
            MailRowDataPropertyGetter.getRowClientItemId(rowKey, tableView),
            async () => {
                const preparePopoutDataForReadingPane = await lazyPreparePopoutDataForReadingPane.import();
                const folderInfo = preparePopoutDataForReadingPane(tableView);
                return {
                    ...folderInfo,
                    instrumentationContext,
                };
            }
        );
        return;
    }

    // Add custom data to selectMailItem/selectMailItemNonCritical datapoint
    addCustomDataToSelectMailItemDatapoint(mailListItemSelectionSource, tableView, rowKey);

    // When user tries to single select a row
    if (tableView.selectedRowKeys.size === 1) {
        // Do nothing if user is selecting the same item and that item is focused unless
        // user has reading pane off setting AND the message was selected via keyboard enter,
        // clicking on mail item body, clicking on the preview image/doc or via route handler.
        if (
            tableView.selectedRowKeys.has(rowKey) &&
            rowKey === tableView.focusedRowKey &&
            !(
                isReadingPanePositionOff() &&
                (mailListItemSelectionSource == MailListItemSelectionSource.KeyboardEnter ||
                    mailListItemSelectionSource == MailListItemSelectionSource.MailListItemBody ||
                    mailListItemSelectionSource ==
                        MailListItemSelectionSource.MailListItemRichPreview ||
                    mailListItemSelectionSource == MailListItemSelectionSource.RouteHandler)
            )
        ) {
            // End the SelectMailItemNonCritical datapoint here and end with background success since reading pane
            // is already loaded.
            endSelectMailItemDatapoint();
            return;
        }

        // Before reseting selection, need to mark the previously selected row as read
        const oldSelectedRowKey = [...tableView.selectedRowKeys.keys()][0];
        lazyOnSingleSelectionChanged.importAndExecute(
            oldSelectedRowKey,
            tableView,
            isUserNavigation
        );
    }

    // Reset list view selection
    resetSelectionInternal(tableView);

    setFocusedRowKey(tableView, rowKey);

    // Set the selection anchor for possible future range, keyboard, or multi selections
    setSelectionAnchorRowKey(tableView, rowKey);
    setMultiSelectionAnchorRowKey(tableView, null);

    // Select new item
    setSelectionOnRow(rowKey, tableView.id, true /* shouldSelect */);
});
