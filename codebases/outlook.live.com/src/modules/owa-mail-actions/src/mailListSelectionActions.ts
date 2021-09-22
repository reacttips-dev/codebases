import type { IPoint } from '@fluentui/react/lib/Utilities';
import { addDatapointConfig, DatapointConfig } from 'owa-analytics-actions';
import { SelectionDirection, TableView } from 'owa-mail-list-store';
import { MailListItemSelectionSource } from 'owa-mail-store';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs';
export { default as ReactListViewType } from 'owa-service/lib/contract/ReactListViewType';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Single select mail row action
 * @param tableView where the operation is being performed
 * @param rowKey the rowKey of the item to select
 * @param isUserNavigation whether user's click or action triggered this action
 * @param mailListItemSelectionSource The source of selection on mail item
 */
export const singleSelectRow = action(
    'SINGLE_SELECT_ROW',
    (
        tableView: TableView,
        rowKey: string,
        isUserNavigation: boolean,
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => {
        return addDatapointConfig(
            createSelectMailItemDatapointConfig(mailListItemSelectionSource, tableView, rowKey),
            {
                tableView,
                rowKey,
                isUserNavigation,
                mailListItemSelectionSource,
            }
        );
    }
);

/**
 * Toggle selection state on the given row
 * @param tableView where the selection took place
 * @param rowKey the rowKey of the item to toggle selection on
 * @param isUserNavigation whether user's click or action triggered this action
 * @param mailListItemSelectionSource The source of selection on mail item
 */
export const toggleSelectRow = action(
    'TOGGLE_SELECT_ROW',
    (
        tableView: TableView,
        rowKey: string,
        isUserNavigation: boolean,
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => {
        return addDatapointConfig(
            createSelectMailItemDatapointConfig(mailListItemSelectionSource, tableView, rowKey),
            {
                tableView,
                rowKey,
                isUserNavigation,
                mailListItemSelectionSource,
            }
        );
    }
);

/**
 * After promise has returned following a selection change action
 * @param rowKey the rowKey of the item that selection changed on
 * @param tableView where the selection took place
 * @param mailListItemSelectionSource The source of selection on mail item
 * @param listViewType - list view type (e.g. conversation, item)
 */
export const onAfterSelectionChanged = action(
    'ON_AFTER_SELECTION_CHANGED',
    (
        rowKey: string,
        tableView: TableView,
        mailListItemSelectionSource: MailListItemSelectionSource,
        listViewType: ReactListViewType,
        sxsId: string
    ) => ({
        rowKey,
        tableView,
        mailListItemSelectionSource,
        listViewType,
        sxsId,
    })
);

/**
 * Reset the list view expansion state (expanded conversation)
 */
export const resetListViewExpansionViewState = action('RESET_LIST_VIEW_EXPANSION_VIEW_STATE');

/**
 * Set the list view expansion state to second level expansion by setting loading to false and latestItemIdsInEachFork to null
 */
export const setSecondLevelListViewExpansion = action(
    'SET_SECOND_LEVEL_LIST_VIEW_EXPANSION',
    (rowKey: string) => ({ rowKey })
);

/**
 * Called when an item part is selected
 * @param nodeId the nodeId of the selected item part
 * @param itemId the itemId of the selected item part
 * @param allNodeIds the nodeIds of the conversation
 * @param tableView - where the selection took place
 * @param mailListItemSelectionSource The source of selection on item part
 */
export const itemPartSelected = action(
    'ITEM_PART_SELECTED',
    (
        nodeId: string,
        itemId: string,
        allNodeIds: string[],
        tableView: TableView,
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => ({
        nodeId,
        itemId,
        allNodeIds,
        tableView,
        mailListItemSelectionSource,
    })
);

/**
 * Called when an item part is selected
 * @param rowKey the rowKey for the parent conversation of the item part
 * @param tableView - where the delete took place
 */
export const selectNextItemPart = action(
    'SELECT_NEXT_ITEM_PART',
    (rowKey: string, tableView: TableView) => ({
        rowKey,
        tableView,
    })
);

/**
 * Called to open the context menu for an expanded item part
 * @param contextMenuAnchor anchor from which the context menu will open
 * @param nodeId the Id of the item part that was selected
 * @param tableViewId the id of the table where the conversation belongs
 */
export const onItemPartContextMenu = action(
    'ON_ITEM_PART_CONTEXT_MENU',
    (contextMenuAnchor: IPoint, nodeId: string, tableViewId: string) => ({
        contextMenuAnchor,
        nodeId,
        tableViewId,
    })
);

/**
 * Select a single expanded item part
 * @param rowKey the instance key of the conversation
 * @param nodeIdToSelect the nodeId of the item part to select
 * @param allNodeIds of the conversation
 * @param tableViewId the id of the table where the conversation belongs
 * @param currentSelectedNodeIds the ids of currently selected itemparts in expanded conversation
 */
export const singleSelectItemPart = action(
    'SINGLE_SELECT_ITEM_PART',
    (
        rowKey: string,
        nodeIdToSelect: string,
        allNodeIds: string[],
        tableViewId: string,
        currentSelectedNodeIds?: string[]
    ) => ({
        rowKey,
        nodeIdToSelect,
        allNodeIds,
        tableViewId,
        currentSelectedNodeIds,
    })
);

/**
 * Toggle selection on an item part
 * @param nodeId the nodeId of the item part to toggle selection
 */
export const toggleSelectItemPart = action('TOGGLE_SELECT_ITEM_PART', (nodeId: string) => ({
    nodeId,
}));

/**
 * Toggle between select all and clear selection on the table
 * @param tableView where the operation is being performed
 */
export const toggleSelectAllRows = action('TOGGLE_SELECT_ALL_ROWS', (tableView: TableView) => ({
    tableView,
}));

/**
 * Perform range selection from current selection to target row key
 * @param tableView where the selection took place
 * @param targetRowKey the rowKey of the item to extend range selection to
 * @param mailListItemSelectionSource The source of selection on mail item
 * @param isCtrlOrCmdKeyDown - whether the Control or Command key is down for this operation
 */
export const rangeSelectRow = action(
    'RANGE_SELECT_ROW',
    (
        tableView: TableView,
        targetRowKey: string,
        mailListItemSelectionSource: MailListItemSelectionSource,
        isCtrlOrCmdKeyDown?: boolean
    ) => ({
        tableView,
        targetRowKey,
        mailListItemSelectionSource,
        isCtrlOrCmdKeyDown,
    })
);

/**
 * Resets selection in the given table
 * @param tableView where the operation is being performed
 * @param mailListItemSelectionSource selection mode for the maillist item
 */
export const resetSelection = action(
    'RESET_SELECTION',
    (tableView: TableView, mailListItemSelectionSource: MailListItemSelectionSource) => ({
        tableView,
        mailListItemSelectionSource,
    })
);

/**
 * Resets selection in the given table
 * @param tableView where the operation is being performed
 */
export const resetSelectionOnTable = action('RESET_SELECTION', (tableView: TableView) => ({
    tableView,
}));

/**
 * Select the next row in the direction given
 * @param tableView where the operation is being performed
 * @param selectionDirection the direction in which to select next row
 * @param mailListItemSelectionSource selection mode for the maillist item
 */
export const selectRowInDirection = action(
    'SELECT_ROW_IN_DIRECTION',
    (
        tableView: TableView,
        selectionDirection: SelectionDirection,
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => {
        return addDatapointConfig(
            createSelectMailItemDatapointConfig(
                mailListItemSelectionSource,
                tableView,
                undefined /* rowKey */,
                selectionDirection
            ),
            {
                tableView,
                selectionDirection,
                mailListItemSelectionSource,
            }
        );
    }
);

export const setExpansionForRow = action(
    'SET_EXPANSION_FOR_ROW',
    (rowKey: string, mailListItemSelectionSource: MailListItemSelectionSource) => ({
        rowKey,
        mailListItemSelectionSource,
    })
);

/**
 * Select the row in the direction given in multiselect mode
 * @param tableView where the operation is being performed
 * @param mailListItemSelectionSource selection mode for the maillist item
 * @param selectionDirection direction in which the keyboard multiselection is happening (shift-up == Next, shift-down == Previous)
 * @param isCtrlOrCmdKeyDown whether user is also holding down ctrl or command key
 */
export const keyboardMultiSelectRow = action(
    'KEYBOARD_MULTI_SELECT_ROW',
    (
        tableView: TableView,
        mailListItemSelectionSource: MailListItemSelectionSource,
        selectionDirection: SelectionDirection,
        isCtrlOrCmdKeyDown: boolean
    ) => ({
        tableView,
        mailListItemSelectionSource,
        selectionDirection,
        isCtrlOrCmdKeyDown,
    })
);

/**
 * Collapse a given conversation when a user gives a keydown command
 * @param rowKey the row to collapse
 */
export const keyboardCollapseConversation = action(
    'KEYBOARD_COLLAPSE_CONVERSATION',
    (rowKey: string) => ({
        rowKey,
    })
);

export const resetBusStopStateMap = action('RESET_BUS_STOP_STATE_MAP');

/**
 * Selects a new row on row removal
 * @param tableView where the operation is being performed
 * @param lastSelectedRowIndex index of the row that was last selected
 * @param lastSelectedRowWasPinned whether last selected row was pinned
 */
export const selectNewItemUponRowRemoval = action(
    'SELECT_NEW_ITEM_UPON_ROW_REMOVAL',
    (tableView: TableView, lastSelectedRowIndex: number, lastSelectedRowWasPinned: boolean) => ({
        tableView,
        lastSelectedRowIndex,
        lastSelectedRowWasPinned,
    })
);

function createSelectMailItemDatapointConfig(
    mailListItemSelectionSource: MailListItemSelectionSource,
    tableView: TableView,
    rowKey: string | undefined,
    selectionDirection?: SelectionDirection
): DatapointConfig {
    const isCoreAction = isSelectMailItemCore(
        mailListItemSelectionSource,
        tableView,
        rowKey,
        selectionDirection
    );
    return {
        name: isCoreAction ? 'SelectMailItem' : 'SelectMailItemNonCritical',
        options: { timeout: 90 * 1000 },
    };
}

// Considered a non-core select mail item if:
// - Opening a popout (since this will drag down perf scenarios)
// - In SLV and will not load the RP
// - Selecting the same item in 3 col
function isSelectMailItemCore(
    mailListItemSelectionSource: MailListItemSelectionSource,
    tableView: TableView,
    rowKey: string | undefined,
    selectionDirection: SelectionDirection | undefined
) {
    return !(
        willOpenPopout(mailListItemSelectionSource) ||
        (isReadingPanePositionOff() && !willLoadRPInSLV(mailListItemSelectionSource)) ||
        isSelectingSameItem3Col(mailListItemSelectionSource, tableView, rowKey, selectionDirection)
    );
}

function isSelectingSameItem3Col(
    mailListItemSelectionSource: MailListItemSelectionSource,
    tableView: TableView,
    rowKey?: string,
    selectionDirection?: SelectionDirection
) {
    if (isReadingPanePositionOff()) {
        return false;
    }
    if (mailListItemSelectionSource === MailListItemSelectionSource.KeyboardUpDown) {
        const anchorIndex = tableView.rowKeys.indexOf(tableView.selectionAnchorRowKey);
        if (anchorIndex !== -1 && tableView.selectedRowKeys.size === 1) {
            const selectedIndex = tableView.rowKeys.indexOf(
                [...tableView.selectedRowKeys.keys()][0]
            );
            // If doing keyboard up/down, selecting the same item if, for the given direction, anchor is
            // above/below current selected item or selection is at the end of the list
            return selectionDirection === SelectionDirection.Next
                ? selectedIndex === anchorIndex + 1 ||
                      (selectedIndex === tableView.rowKeys.length - 1 &&
                          anchorIndex === tableView.rowKeys.length - 1)
                : selectedIndex === anchorIndex - 1 || (selectedIndex === 0 && anchorIndex === 0);
        }
        return false;
    }
    return rowKey && tableView.selectedRowKeys.has(rowKey) && tableView.selectedRowKeys.size === 1;
}

function willLoadRPInSLV(mailListItemSelectionSource: MailListItemSelectionSource) {
    return (
        mailListItemSelectionSource === MailListItemSelectionSource.KeyboardEnter ||
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemBody ||
        mailListItemSelectionSource === MailListItemSelectionSource.RouteHandler ||
        mailListItemSelectionSource === MailListItemSelectionSource.CommandBarArrows ||
        (mailListItemSelectionSource === MailListItemSelectionSource.ImmersiveReadingPaneDelete &&
            getUserConfiguration().UserOptions?.NextSelection !== 'ReturnToView')
    );
}

function willOpenPopout(mailListItemSelectionSource: MailListItemSelectionSource) {
    return (
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemRichPreview ||
        mailListItemSelectionSource === MailListItemSelectionSource.KeyboardShiftEnter ||
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemBodyDoubleClick
    );
}
