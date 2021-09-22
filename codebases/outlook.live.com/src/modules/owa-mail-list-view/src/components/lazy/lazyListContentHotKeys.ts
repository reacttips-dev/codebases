import { isGroupTableQuery } from 'owa-group-utils';
import type { KeydownConfig } from 'owa-hotkeys';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { lazyOnKeyboardMarkAsRead } from 'owa-mail-mark-read-actions';
import { lazyExpandCollapseAllItemParts } from 'owa-mail-reading-pane-store';
import isAllItemPartsExpanded from 'owa-mail-reading-pane-store/lib/utils/isAllItemPartsExpanded';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import {
    lazyOnKeyboardToggleFlagState,
    lazyOnKeyboardMarkAsJunkNotJunk,
    lazyToggleIgnoreConversations,
} from 'owa-mail-triage-action';
import onArchive from 'owa-mail-commands/lib/actions/onArchive';
import { onReply, onReplyAll, onForward } from 'owa-mail-commands/lib/actions/onResponse';
import onDelete from 'owa-mail-commands/lib/actions/onDelete';
import {
    getIsEverythingSelectedInTable,
    listViewStore,
    TableView,
    SelectionDirection,
    isConversationView,
} from 'owa-mail-list-store';
import {
    lazyOnOpenEmail,
    lazyOnKeyboardUpDown,
    lazyOnKeyboardToggleSelect,
} from 'owa-mail-actions';
import {
    keyboardMultiSelectRow,
    toggleSelectAllRows,
    singleSelectRow,
    resetSelection,
    keyboardCollapseConversation,
} from 'owa-mail-actions/lib/mailListSelectionActions';
import { navigateToTopOfListView } from '../../utils/navigateToTopOfListView';
import MailListContextMenuType from 'owa-mail-list-store/lib/store/schema/MailListContextMenuType';
import { showMailItemContextMenu } from 'owa-mail-list-actions/lib/actions/itemContextMenuActions';
import { getMailMenuItemShouldShowMap, MenuItemType } from 'owa-mail-filterable-menu-behavior';
import shouldAllowDelete from 'owa-mail-filterable-menu-behavior/lib/utils/shouldAllowDelete';
import debounce from 'lodash-es/debounce';

const keyboardActionSource = 'Keyboard';

export function setupMailListContentKeys(tableViewId: string): KeydownConfig[] {
    return [
        { command: getCommands().openMail, handler: () => openMail(tableViewId) },
        {
            command: getCommands().openMailInPopout,
            handler: () => openMailInPopout(tableViewId),
        },
        {
            command: getCommands().home,
            handler: () =>
                navigateToTopOfListView(tableViewId, MailListItemSelectionSource.KeyboardHome),
        },
        { command: getCommands().end, handler: () => end(tableViewId) },
        { command: getCommands().selectAll, handler: () => selectAll(tableViewId) },
        {
            command: getCommands().deselectAll,
            handler: () => deselectAll(tableViewId),
        },
        {
            command: 'down',
            handler: () => keyboardUpDownSelectMailItem(tableViewId, SelectionDirection.Next),
            options: { stopPropagation: false },
        },
        {
            command: 'up',
            handler: () => keyboardUpDownSelectMailItem(tableViewId, SelectionDirection.Previous),
            options: { stopPropagation: false },
        },
        {
            command: 'ctrl+down',
            handler: () => focusNextRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: 'ctrl+up',
            handler: () => focusPreviousRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: 'shift+down',
            handler: () => keyboardShiftMultiSelectNextRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: 'shift+ctrl+down',
            handler: () => keyboardCtrlShiftMultiSelectNextRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: 'shift+up',
            handler: () => multiselectPrevRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: 'shift+ctrl+up',
            handler: () => keyboardCtrlShiftMultiSelectPreviousRow(tableViewId),
            options: { stopPropagation: false },
        },
        {
            command: getCommands().selectUnselectMessage,
            handler: () => keyboardToggleSelect(tableViewId),
        },
        {
            command: getCommands().expandCollapseAll,
            handler: () => expandCollapseConversationItems(tableViewId),
        },
        {
            command: getCommands().expandAll,
            handler: () => expandCollapseConversationItems(tableViewId, true /*expand*/),
        },
        {
            command: getCommands().collapseAll,
            handler: () => expandCollapseConversationItems(tableViewId, false /*expand*/),
        },
        /**
         * Because "Delete" is a common keyboard shortcut that isn't solely responsible
         * for a triage action (i.e. deleting a persona pill from the recipient well),
         * it cannot be global.
         */
        {
            command: getCommands().deleteMail,
            handler: () => deleteRow(tableViewId),
        },
        {
            command: getCommands().softDeleteMail,
            handler: () => softDeleteRow(tableViewId),
        },
    ];
}

export function setupTriageActionKeys(tableViewId: string): KeydownConfig[] {
    const keys = [
        { command: getCommands().forward, handler: () => forwardRow() },
        { command: getCommands().replyAll, handler: () => replyAllToRow() },
        { command: getCommands().reply, handler: () => replyToRow() },
        {
            command: getCommands().toggleFlag,
            // Throttle the keyboard command to prevent rapid calls when shortcut is held down
            handler: debounce(() => toggleFlag(tableViewId), 300, {
                leading: true,
                trailing: false,
            }),
        },
        {
            command: getCommands().markAsRead,
            handler: () => markAsReadRow(tableViewId),
        },
        {
            command: getCommands().markAsUnread,
            handler: () => markAsUnreadRow(tableViewId),
        },
        {
            command: getCommands().markAsJunk,
            handler: () => markAsJunk(tableViewId),
        },
        {
            command: getCommands().archiveMail,
            handler: () => archiveRow(tableViewId),
        },
        {
            command: getCommands().moveToFolder,
            handler: () =>
                contextMenuShortcutHandler(
                    tableViewId,
                    MailListContextMenuType.MoveTo,
                    MenuItemType.Move
                ),
        },
        {
            command: getCommands().categorize,
            handler: () =>
                contextMenuShortcutHandler(
                    tableViewId,
                    MailListContextMenuType.Categorize,
                    MenuItemType.Categories
                ),
        },
        {
            command: getCommands().snooze,
            handler: () =>
                contextMenuShortcutHandler(
                    tableViewId,
                    MailListContextMenuType.Snooze,
                    MenuItemType.Schedule
                ),
        },
        {
            command: getCommands().ignore,
            handler: () => ignoreConversation(tableViewId),
        },
    ];

    return keys;
}

function contextMenuShortcutHandler(
    tableViewId: string,
    ContextMenuType: MailListContextMenuType,
    menuItemType: MenuItemType
) {
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    const shouldShowBehavior = shouldShowBehaviorMap[menuItemType];
    if (!shouldShowBehavior()) {
        return;
    }

    const contextMenuMountPoint = getContextMenuMountPoint(tableViewId);
    if (contextMenuMountPoint) {
        showMailItemContextMenu(
            { x: contextMenuMountPoint.x, y: contextMenuMountPoint.y },
            ContextMenuType
        );
    }
}

function getContextMenuMountPoint(tableViewId: string) {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];

    // If there is no selection, then shortcut is a no-op.
    if (selectedRowKeys.length === 0) {
        return null;
    }

    /**
     * First, try to mount the context menu on the row being acted upon. If the
     * row isn't visible (i.e. immersive reading pane is open), then the clientRect
     * won't have any information (i.e. height will be 0).
     */
    const row = document.getElementById(selectedRowKeys[0]);
    const rowClientRect = row?.getBoundingClientRect();
    if (rowClientRect?.height > 0) {
        return { x: rowClientRect.right, y: rowClientRect.top };
    }

    /**
     * Next, try to mount the context menu on the exit button of the immersive
     * reading pane. If it's not visible, then the clientRect won't have any
     * info.
     */
    const immersiveExitButton = document.getElementById('immersiveExitButton');
    const immersiveExitButtonClientRect = immersiveExitButton?.getBoundingClientRect();
    if (immersiveExitButtonClientRect?.height > 0) {
        return { x: immersiveExitButtonClientRect.right, y: immersiveExitButtonClientRect.bottom };
    }

    return null;
}

function expandCollapseConversationItems(tableViewId: string, expand?: boolean) {
    const tableView = getTableView(tableViewId);
    const selectedRowKeys = [...tableView?.selectedRowKeys.keys()];

    /**
     * Expand collapse only when in conversation view and
     * a single rowKey is selected.
     */
    if (isConversationView(tableView) && selectedRowKeys.length == 1) {
        const rowKey = selectedRowKeys[0];

        const shouldExpand = expand != null ? expand : !isAllItemPartsExpanded(rowKey);
        lazyExpandCollapseAllItemParts.importAndExecute(
            rowKey,
            shouldExpand /*shouldExpand*/,
            true /*isFromShortcut*/
        );

        if (shouldExpand) {
            singleSelectRow(
                tableView,
                rowKey,
                true /* isUserNavigation */,
                MailListItemSelectionSource.MailListItemTwisty
            );
        } else {
            keyboardCollapseConversation(rowKey);
        }
    }
}

function onKeyboardMultiSelectRow(
    tableViewId: string,
    selectionDirection: SelectionDirection,
    isCtrlOrCmdKeyDown: boolean
) {
    keyboardMultiSelectRow(
        getTableView(tableViewId),
        MailListItemSelectionSource.KeyboardUpDown,
        selectionDirection,
        isCtrlOrCmdKeyDown
    );
}

function keyboardShiftMultiSelectNextRow(tableViewId: string) {
    onKeyboardMultiSelectRow(tableViewId, SelectionDirection.Next, false /* isCtrlOrCmdKeyDown */);
}

function keyboardCtrlShiftMultiSelectNextRow(tableViewId: string) {
    onKeyboardMultiSelectRow(tableViewId, SelectionDirection.Next, true /* isCtrlOrCmdKeyDown */);
}

function keyboardToggleSelect(tableViewId: string) {
    lazyOnKeyboardToggleSelect.importAndExecute(
        getTableView(tableViewId),
        MailListItemSelectionSource.KeyboardCtrlSpace
    );
}

function multiselectPrevRow(tableViewId: string) {
    onKeyboardMultiSelectRow(
        tableViewId,
        SelectionDirection.Previous,
        false /* isCtrlOrCmdKeyDown */
    );
}

function keyboardCtrlShiftMultiSelectPreviousRow(tableViewId: string) {
    onKeyboardMultiSelectRow(
        tableViewId,
        SelectionDirection.Previous,
        true /* isCtrlOrCmdKeyDown */
    );
}

function keyboardUpDownSelectMailItem(tableViewId: string, selectionDirection: SelectionDirection) {
    lazyOnKeyboardUpDown.importAndExecute(
        selectionDirection,
        getTableView(tableViewId),
        MailListItemSelectionSource.KeyboardUpDown,
        true /* shouldSelect */
    );
}

function focusNextRow(tableViewId: string) {
    lazyOnKeyboardUpDown.importAndExecute(
        SelectionDirection.Next,
        getTableView(tableViewId),
        MailListItemSelectionSource.KeyboardUpDown,
        false /* shouldSelect */
    );
}

function focusPreviousRow(tableViewId: string) {
    lazyOnKeyboardUpDown.importAndExecute(
        SelectionDirection.Previous,
        getTableView(tableViewId),
        MailListItemSelectionSource.KeyboardUpDown,
        false /* shouldSelect */
    );
}

function selectAll(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    if (!getIsEverythingSelectedInTable(tableView)) {
        toggleSelectAllRows(tableView);
    }
}

// deselectAll is tied to esc key in certain key sets
// We stop propagation only when we toggleCheckAll, else
// we let the event to propagate
function deselectAll(tableViewId: string) {
    const tableView = getTableView(tableViewId);

    if (getIsEverythingSelectedInTable(tableView)) {
        toggleSelectAllRows(tableView);
    } else {
        resetSelection(tableView, MailListItemSelectionSource.Reset);
    }
}

function end(tableViewId: string) {
    const tableView = getTableView(tableViewId);

    if (tableView.rowKeys.length > 0) {
        singleSelectRow(
            tableView,
            tableView.rowKeys[tableView.rowKeys.length - 1], // Select last row in view
            true /* isUserNavigation */,
            MailListItemSelectionSource.KeyboardEnd
        );
    }
}

function openMail(tableViewId: string) {
    const tableView = getTableView(tableViewId);

    lazyOnOpenEmail.importAndExecute(
        tableView,
        listViewStore.expandedConversationViewState.selectedNodeIds,
        [...tableView.selectedRowKeys.keys()],
        MailListItemSelectionSource.KeyboardEnter
    );
}

function openMailInPopout(tableViewId: string) {
    const tableView = getTableView(tableViewId);

    lazyOnOpenEmail.importAndExecute(
        tableView,
        listViewStore.expandedConversationViewState.selectedNodeIds,
        [...tableView.selectedRowKeys.keys()],
        MailListItemSelectionSource.KeyboardShiftEnter
    );
}

function archiveRow(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    // archiving is disabled for groups
    if (isGroupTableQuery(tableView.tableQuery)) {
        return;
    }
    onArchive(keyboardActionSource);
}

function markAsJunk(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    // mark as junk is disabled for groups
    if (isGroupTableQuery(tableView.tableQuery)) {
        return;
    }

    lazyOnKeyboardMarkAsJunkNotJunk.importAndExecute(
        tableView,
        listViewStore.expandedConversationViewState.selectedNodeIds,
        [...tableView.selectedRowKeys.keys()]
    );
}

function markAsReadRow(tableViewId: string) {
    markAsReadUnreadInternal(tableViewId, true /* isReadValueToSet */);
}

function markAsUnreadRow(tableViewId: string) {
    markAsReadUnreadInternal(tableViewId, false /* isReadValueToSet */);
}

function markAsReadUnreadInternal(tableViewId: string, isReadValueToSet: boolean) {
    const tableView = getTableView(tableViewId);
    const isInVirtualSelectAllMode = tableView.isInVirtualSelectAllMode;
    const rowKeysToActOn = isInVirtualSelectAllMode ? [] : [...tableView.selectedRowKeys.keys()];
    const exclusionList = isInVirtualSelectAllMode ? tableView.virtualSelectAllExclusionList : [];
    lazyOnKeyboardMarkAsRead.importAndExecute(
        tableView,
        listViewStore.expandedConversationViewState.selectedNodeIds,
        isInVirtualSelectAllMode,
        rowKeysToActOn,
        exclusionList,
        isReadValueToSet
    );
}

function toggleFlag(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    // toggle flag is disabled for groups
    if (isGroupTableQuery(tableView.tableQuery)) {
        return;
    }

    lazyOnKeyboardToggleFlagState.importAndExecute(
        tableView,
        listViewStore.expandedConversationViewState.selectedNodeIds,
        [...tableView.selectedRowKeys.keys()]
    );
}

function deleteRow(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    if (shouldAllowDelete(tableView)) {
        onDelete(
            keyboardActionSource /* ActionSourceMailStore */,
            keyboardActionSource /* ActionSourceAnalyticsActions */,
            false /* isSoftDelete */
        );
    }
}

function softDeleteRow(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    if (shouldAllowDelete(tableView)) {
        onDelete(
            keyboardActionSource /* ActionSourceMailStore */,
            keyboardActionSource /* ActionSourceAnalyticsActions */,
            true /* isSoftDelete */
        );
    }
}

function replyToRow() {
    onReply(keyboardActionSource);
}

function replyAllToRow() {
    onReplyAll(keyboardActionSource);
}

function forwardRow() {
    onForward(keyboardActionSource);
}

async function ignoreConversation(tableViewId: string) {
    const tableView = getTableView(tableViewId);
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    const shouldShowBehavior = shouldShowBehaviorMap[MenuItemType.Ignore];

    const toggleIgnoreConversations = await lazyToggleIgnoreConversations.import();
    toggleIgnoreConversations(
        selectedRowKeys,
        tableView,
        shouldShowBehavior(),
        keyboardActionSource
    );
}

function getTableView(tableViewId: string): TableView {
    return listViewStore.tableViews.get(tableViewId);
}
