import {
    rangeSelectRow,
    singleSelectRow,
    toggleSelectRow,
} from 'owa-mail-actions/lib/mailListSelectionActions';
import { onSingleMailItemSelected } from 'owa-mail-actions/lib/mailListActions';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import type * as React from 'react';
import { isMac } from 'owa-user-agent';

/**
 * A handler for events created by user clicking mail list item(s)
 * @param evt the mouse event
 * @param selectionSource the source of event
 * @param rowKey the given conversation rowKeys
 * @param tableViewId - the table view id that this conversation belong to (or null if we don't care)
 * @returns a promise with boolean value based on if we have handled the event here
 */
export default function onMailListItemClickHandler(
    evt: React.MouseEvent<unknown> | KeyboardEvent,
    selectionSource: MailListItemSelectionSource,
    rowKey: string,
    tableViewId: string
): void {
    evt.stopPropagation();

    // If the OS is a Mac, use evt.metaKey to detect Cmd key
    const isCtrlOrCmdKeyDown = isMac() ? evt.metaKey : evt.ctrlKey;
    const tableView = listViewStore.tableViews.get(tableViewId);
    let isExplicitSelect;

    // The promise returns false if we do not handle the click here
    // Otherise promise returns true meaning we have captured the click event here
    if (evt.shiftKey) {
        rangeSelectRow(tableView, rowKey, selectionSource, isCtrlOrCmdKeyDown);
    } else if (
        isCtrlOrCmdKeyDown ||
        selectionSource === MailListItemSelectionSource.MailListItemCheckbox
    ) {
        toggleSelectRow(tableView, rowKey, true /* isUserNavigation */, selectionSource);
    } else {
        singleSelectRow(tableView, rowKey, true /* isUserNavigation */, selectionSource);
        isExplicitSelect = selectionSource !== MailListItemSelectionSource.MailListItemRichPreview;
    }

    if (isExplicitSelect && !getIsSearchTableShown()) {
        onSingleMailItemSelected();
    }
}
