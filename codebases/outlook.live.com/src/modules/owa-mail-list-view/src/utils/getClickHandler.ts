import * as lazyTriageActions from 'owa-mail-triage-action';
import { listViewStore } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { lazyResetFocus } from 'owa-mail-focus-manager';

// Return the correct handler for the action/ item type. Currently item part only supports big hover delete.
export function getClickHandler(action: string, isItemPart?: boolean) {
    switch (action) {
        case 'Delete':
            return isItemPart ? deleteItemPartRow : deleteRow;
        case 'Archive':
            return archiveRow;
    }
    return null;
}

export const deleteRow = async (
    rowKey: string,
    tableViewId: string,
    hoverActionSource: ActionSource
) => {
    await lazyTriageActions.lazyDeleteMailListRows.importAndExecute(
        [rowKey],
        tableViewId,
        false /*isExplicitSoftDelete*/,
        hoverActionSource
    );
};

export const archiveRow = async (
    rowKey: string,
    tableViewId: string,
    hoverActionSource: ActionSource
) => {
    await lazyTriageActions.lazyArchiveMailListRows.importAndExecute(
        [rowKey],
        listViewStore.tableViews.get(tableViewId),
        hoverActionSource
    );
};

export const deleteItemPartRow = async (
    tableViewId: string,
    nodeId: string,
    hoverActionSource: ActionSource
) => {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const deleteItemsBasedOnNodeOrThreadIds = await lazyTriageActions.lazyDeleteItemsBasedOnNodeOrThreadIds.import();
    deleteItemsBasedOnNodeOrThreadIds([nodeId], tableView.id, hoverActionSource);
    // Reset focus after the lazy action is complete, to ensure that focus is set
    // after any confirm dialogs are dismissed and the stitch has been raised
    lazyResetFocus.importAndExecute();
};
