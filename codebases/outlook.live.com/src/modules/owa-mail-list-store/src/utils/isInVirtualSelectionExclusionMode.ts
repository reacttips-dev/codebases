import type { TableView } from '../index';

// Determines whether in virtual select all mode with an exclusion list.
export default function isInVirtualSelectionExclusionMode(tableView: TableView): boolean {
    const { isInVirtualSelectAllMode, virtualSelectAllExclusionList } = tableView;
    return isInVirtualSelectAllMode && virtualSelectAllExclusionList.length > 0;
}
