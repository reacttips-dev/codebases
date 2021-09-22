import { otherViewFilterText } from 'owa-locstrings/lib/strings/otherviewfiltertext.locstring.json';
import { focusedViewFilterText } from 'owa-locstrings/lib/strings/focusedviewfiltertext.locstring.json';
import { searchFolderName } from 'owa-locstrings/lib/strings/searchfoldername.locstring.json';
import loc from 'owa-localize';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { TableQueryType, TableView, getUserCategoryName, getFocusedFilterForTable } from '../index';

/**
 * Get the folder scope text
 * @param focusedViewFilter the focused view filter
 * @param tableQueryType the table query type (mail, group, search)
 * @param folderDisplayName display name of the folder on which the action is taken
 * @returns the folder scope text, e.g Focused Inbox, Other Inbox, Sent Items, etc.
 */
export default function getFolderScopeText(
    tableQueryType: TableQueryType,
    tableView: TableView | undefined,
    folderDisplayName: string
): string {
    if (tableQueryType === TableQueryType.Search) {
        return loc(searchFolderName);
    }

    if (tableView) {
        if (getUserCategoryName(tableView)) {
            return getUserCategoryName(tableView);
        }

        const focusedViewFilter = getFocusedFilterForTable(tableView);
        switch (focusedViewFilter) {
            case FocusedViewFilter.Focused:
                return loc(focusedViewFilterText);
            case FocusedViewFilter.Other:
                return loc(otherViewFilterText);
        }
    }
    return folderDisplayName;
}
