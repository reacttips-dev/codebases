import {
    moveToFocusedInboxText,
    moveToOtherInboxText,
    alwaysMoveToFocusedInboxText,
    alwaysMoveToOtherInboxText,
    moveToFolderMoveAllFrom,
    moveToOtherDisabledDueToOverride,
} from './getMoveToMenuProperties.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47719 */
import { MOVETO_WIDTH } from '../utils/constants';
import type { ActionSource } from 'owa-analytics-types';
import type { ShouldShowBehavior } from 'owa-filterable-menu';
import { MenuItemType } from 'owa-mail-filterable-menu-behavior';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { getCustomIcon } from 'owa-folders-common';
import { getMoveToMenuProps, MoveToMenuItem } from 'owa-mail-moveto-control';
import onSweep from 'owa-mail-commands/lib/actions/onSweep';
import * as lazyTriageActions from 'owa-mail-triage-action';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import * as React from 'react';
import { TableView, listViewStore, isItemPartOperation } from 'owa-mail-list-store';
import { IContextualMenuProps, DirectionalHint } from '@fluentui/react/lib/ContextualMenu';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyOnSingleSelectionChanged } from 'owa-mail-mark-read-actions';
import type { MailboxType } from 'owa-graph-schema';
import { createNewFolder } from './createNewFolderUtil';
import { isFocusedInboxOverridden } from '../utils/isFocusedInboxOverridden';

import styles from './MailMoveToMenuStyles.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

/**
 * Gets Inbox menu items
 */
function getInboxMenuItems(
    tableView: TableView,
    nonIconClassName: string,
    iconClassName: string,
    onAfterMenuClicked: () => void,
    actionSource: ActionSource,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior }
): JSX.Element[] {
    let items: JSX.Element[] = [];

    // Add move to Focused/Other
    if (shouldShowBehaviorMap[MenuItemType.MoveToFocusedInbox]()) {
        items.push(
            <div
                key={'moveTo' + loc(moveToFocusedInboxText)}
                className={nonIconClassName}
                data-is-focusable={true}
                onClick={() => {
                    lazyTriageActions.lazyMoveMailListRowsToFocusedOrOther.importAndExecute(
                        [...tableView.selectedRowKeys.keys()],
                        tableView.id,
                        FocusedViewFilter.Focused,
                        actionSource
                    );
                    onAfterMenuClicked();
                }}>
                <span className={styles.moveToFocusedOtherMenuItems}>
                    {loc(moveToFocusedInboxText)}
                </span>
            </div>
        );
    } else if (shouldShowBehaviorMap[MenuItemType.MoveToOtherInbox]()) {
        items.push(
            <div
                key={'moveTo' + loc(moveToOtherInboxText)}
                className={nonIconClassName}
                aria-label={loc(moveToOtherInboxText)}
                role={'menuitem'}
                data-is-focusable={true}
                onClick={() => {
                    lazyTriageActions.lazyMoveMailListRowsToFocusedOrOther.importAndExecute(
                        [...tableView.selectedRowKeys.keys()],
                        tableView.id,
                        FocusedViewFilter.Other,
                        actionSource
                    );
                    onAfterMenuClicked();
                }}>
                <span className={styles.moveToFocusedOtherMenuItems}>
                    {loc(moveToOtherInboxText)}
                </span>
            </div>
        );
    }

    // Add always move to focused other
    if (shouldShowBehaviorMap[MenuItemType.AlwaysMoveToFocusedInbox]()) {
        items.push(
            <div
                key={'moveTo' + loc(alwaysMoveToFocusedInboxText)}
                className={nonIconClassName}
                data-is-focusable={true}
                onClick={() => {
                    lazyTriageActions.lazyAlwaysMoveRowToFocusedOrOther.importAndExecute(
                        [...tableView.selectedRowKeys.keys()],
                        tableView,
                        FocusedViewFilter.Focused,
                        actionSource
                    );

                    onAfterMenuClicked();
                }}>
                <span className={styles.moveToFocusedOtherMenuItems}>
                    {loc(alwaysMoveToFocusedInboxText)}
                </span>
            </div>
        );
    } else if (shouldShowBehaviorMap[MenuItemType.AlwaysMoveToOtherInbox]()) {
        const shouldShowAsDisabled = isFocusedInboxOverridden(
            [...tableView.selectedRowKeys.keys()][0],
            tableView
        );
        const onPivotClick = shouldShowAsDisabled
            ? null
            : () => {
                  lazyTriageActions.lazyAlwaysMoveRowToFocusedOrOther.importAndExecute(
                      [...tableView.selectedRowKeys.keys()],
                      tableView,
                      FocusedViewFilter.Other,
                      actionSource
                  );

                  onAfterMenuClicked();
              };

        const pivotContent = (
            <div
                key={'moveTo' + loc(alwaysMoveToOtherInboxText)}
                className={classNames(nonIconClassName, shouldShowAsDisabled && styles.disabled)}
                aria-label={loc(alwaysMoveToOtherInboxText)}
                role={'menuitem'}
                data-is-focusable={true}
                onClick={onPivotClick}>
                <span
                    className={classNames(
                        styles.moveToFocusedOtherMenuItems,
                        shouldShowAsDisabled && styles.disabled
                    )}>
                    {loc(alwaysMoveToOtherInboxText)}
                </span>
            </div>
        );

        const itemToInsert = shouldShowAsDisabled ? (
            <TooltipHost
                directionalHint={DirectionalHint.rightCenter}
                content={loc(moveToOtherDisabledDueToOverride)}
                id={'FocusOverride'}>
                {pivotContent}
            </TooltipHost>
        ) : (
            pivotContent
        );

        items.push(itemToInsert);
    }

    return items;
}

/**
 * Gets custom menu items for the move to context menu.
 * Custom items will be added to the end of the menu.
 * @param tableView tableView where the move is being performed
 * @param shouldShowBehaviorMap the behavior map used to determine which items to show
 */
function getSweepMenuItem(
    tableView: TableView,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior }
): MoveToMenuItem[] {
    return shouldShowBehaviorMap[MenuItemType.Sweep]()
        ? [
              {
                  title: loc(moveToFolderMoveAllFrom),
                  displayText: loc(moveToFolderMoveAllFrom),
                  onClick: onSweep,
              },
          ]
        : null;
}

/**
 * Moves given rows to a specified folder
 * @param tableView tableView where the move is being performed
 * @param destinationFolderId - the destination folder
 * @param rowKeysToMove the list of rowKeys which will be moved
 */
function moveRows(
    tableViewId: string,
    rowKeysToMove: string[],
    destinationFolderId: string,
    actionSource: ActionSource
): void {
    lazyTriageActions.lazyMoveMailListRows.importAndExecute(
        [...rowKeysToMove],
        destinationFolderId,
        tableViewId,
        actionSource
    );
}

/**
 * Gets the moveto folder menu items for command bar
 * @param tableView the tableView
 * @param actionSource the actionSource
 * @param shouldShowBehaviorMap the behavior map to determine the triage action behavior in a current context
 * @return returns the contextual menu items
 */
export function getMoveToPropertiesForCommandBar(
    tableView: TableView,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior },
    directionalHint: DirectionalHint
): IContextualMenuProps {
    return getMoveToMenuProperties(
        tableView,
        true /* shouldShowSearchBox */,
        () => lazyResetFocus.importAndExecute(), // always reset focus to dismiss the menu from commanding bar
        'CommandBar',
        shouldShowBehaviorMap,
        directionalHint
    );
}

/**
 * Gets the moveto folder menu items for context menu
 * @param tableViewId the tableView id
 * @param dismissMenu the callback to be called to dismiss of menu
 * @param shouldShowBehaviorMap the behavior map to determine the triage action behavior in a current context
 * @param directionalHint determines which direction the callout appears
 * @param rowKeysToMove the list of rowKeys which will be moved
 * @return returns the contextual menu items
 */
export function getMoveToPropertiesForContextMenu(
    tableViewId: string,
    dismissMenu: (ev?: any) => void,
    actionSource: ActionSource,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior },
    directionalHint: DirectionalHint,
    rowKeysToMove?: string[]
): IContextualMenuProps {
    const tableView = listViewStore.tableViews.get(tableViewId);
    return getMoveToMenuProperties(
        tableView,
        true, // shouldShowSearchBox
        dismissMenu, // Callback to dismiss the right click context menu
        actionSource,
        shouldShowBehaviorMap,
        directionalHint,
        rowKeysToMove
    );
}

/**
 * Gets the move to folder menu items
 * @param tableView the tableView
 * @param shouldShowSearchBox flag indicating whether to show search box or not
 * @param dismissMenu callback to be called to dismiss the move to menu context menu
 * @param actionSource the move to menu action source
 * @param shouldShowBehaviorMap the behavior map to determine the triage action behavior in a current context
 * @param directionalHint determines which direction the callout appears
 * @param directionalHintFixed determines whether to keep the direction of the menu same regardless of the space constraints.
 * @param rowKeysToMove the list of rowKeys which will be moved
 * @return returns the contextual menu items
 */
function getMoveToMenuProperties(
    tableView: TableView,
    shouldShowSearchBox: boolean,
    dismissMenu: () => void,
    actionSource: ActionSource,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior },
    directionalHint?: DirectionalHint,
    rowKeysToMove?: string[]
): IContextualMenuProps {
    const supportedMailboxTypes: MailboxType[] = ['UserMailbox'];
    if (!isConsumer()) {
        supportedMailboxTypes.push('ArchiveMailbox', 'SharedMailbox');
    }
    const moveToMenuProps = getMoveToMenuProps({
        supportedMailboxTypes,
        shouldShowSearchBox: shouldShowSearchBox,
        actionSource: actionSource,
        createNewFolder: createNewFolder,
        dismissMenu: dismissMenu,
        onFolderClick: folderId => {
            let markAsReadAction = Promise.resolve();
            // Mark as read only if the selected message/conversation's count is ONE before move.
            // Because only one selected item could be displayed in reading pane. Multiple selected
            // items won't be displayed in reading pane, so they won't be marked as read before move.
            if (rowKeysToMove?.length === 1 || tableView.selectedRowKeys.size === 1) {
                const selectedRowKey = rowKeysToMove
                    ? rowKeysToMove[0]
                    : [...tableView.selectedRowKeys.keys()][0];

                markAsReadAction = lazyOnSingleSelectionChanged.importAndExecute(
                    selectedRowKey,
                    tableView,
                    true
                );
            }

            markAsReadAction.then(() => {
                if (isItemPartOperation()) {
                    lazyTriageActions.lazyMoveItemsBasedOnNodeIds
                        .import()
                        .then(moveItemsBasedOnNodeIds => {
                            moveItemsBasedOnNodeIds(
                                listViewStore.expandedConversationViewState.selectedNodeIds,
                                folderId,
                                tableView.id,
                                actionSource
                            );
                        });
                } else {
                    // Check if rowKeys are explicitly passed (ex: in the case of moveTo quick action). In this case,
                    // the move operation will be performed on the passed 'rowKeysToMove'.
                    moveRows(
                        tableView.id,
                        rowKeysToMove || [...tableView.selectedRowKeys.keys()],
                        folderId,
                        actionSource
                    );
                }
            });
        },
        getMenuItemsToPrepend: (nonIconClassName, iconClassName, onAfterMenuClicked) =>
            getInboxMenuItems(
                tableView,
                nonIconClassName,
                iconClassName,
                onAfterMenuClicked,
                actionSource,
                shouldShowBehaviorMap
            ),
        getCustomIcon: getCustomIcon,
        directionalHint: directionalHint,
        directionalHintFixed: false,
        getCustomMenuItemsToAppend: () => getSweepMenuItem(tableView, shouldShowBehaviorMap),
        width: MOVETO_WIDTH,
        selectedFolderId: tableView.tableQuery.folderId,
        disableSelectedFolder: true,
    });
    return moveToMenuProps;
}
