import { SelectionRestrictionType } from '../Behaviors.types';
import {
    getSelectedTableView,
    getIsEverythingSelectedInTable,
    TableView,
    isInVirtualSelectionExclusionMode,
} from 'owa-mail-list-store';
//import { assertNever } from 'owa-assert';

const selectionRestriction = (selectionRestrictionTypes: SelectionRestrictionType[]) => () => {
    const tableView: TableView = getSelectedTableView();
    const selectedRowsCount = tableView.selectedRowKeys.size;
    let foundSelectionRestriction = false;
    const isInASelectAllMode =
        isInVirtualSelectionExclusionMode(tableView) || getIsEverythingSelectedInTable(tableView);

    for (var selectionRestrictionType of selectionRestrictionTypes) {
        switch (selectionRestrictionType) {
            case SelectionRestrictionType.NoSelection:
                // Exclude the select all mode, because the selection is virtual and list view actually has no selected items.
                foundSelectionRestriction =
                    selectedRowsCount == 0 && !tableView.isInVirtualSelectAllMode;
                break;

            case SelectionRestrictionType.HasAnySelection:
                foundSelectionRestriction = selectedRowsCount > 0 || isInASelectAllMode;
                break;

            case SelectionRestrictionType.HasRealSelection:
                foundSelectionRestriction = selectedRowsCount > 0;
                break;

            case SelectionRestrictionType.SingleSelection:
                foundSelectionRestriction = selectedRowsCount == 1;
                break;

            case SelectionRestrictionType.MultipleAnySelection:
                foundSelectionRestriction = selectedRowsCount > 1 || isInASelectAllMode;
                break;

            case SelectionRestrictionType.MultipleRealSelection:
                foundSelectionRestriction = selectedRowsCount > 1;
                break;
            case SelectionRestrictionType.HasAllVirtuallySelected:
                foundSelectionRestriction =
                    tableView.isInVirtualSelectAllMode &&
                    tableView.virtualSelectAllExclusionList.length === 0;
                break;

            // default:
            //     throw assertNever(selectionRestrictionType);
        }

        // break as soon as we find listview satisfying the selection restriction
        if (foundSelectionRestriction) {
            return true;
        }
    }

    return false;
};

export default selectionRestriction;
