import { action } from 'satcheljs';

/**
 * Set selection state on the given row
 * @param rowKey the rowKey of the item to toggle selection on
 * @param tableViewId of the table where the selection took place
 * @param shouldSelect - whether the row should be selected or deselected
 */
export const setSelectionOnRow = action(
    'SET_SELECTION_ON_ROW',
    (rowKey: string, tableViewId: string, shouldSelect: boolean) => {
        return {
            rowKey,
            tableViewId,
            shouldSelect,
        };
    }
);
