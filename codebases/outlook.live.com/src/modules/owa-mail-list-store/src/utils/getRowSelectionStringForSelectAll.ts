import {
    TableQueryType,
    TableView,
    getUserCategoryName,
    isInVirtualSelectionExclusionMode,
    isConversationView,
} from '../index';

import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { everythingSelectedFocused } from 'owa-locstrings/lib/strings/everythingselectedfocused.locstring.json';
import { everythingSelectedSearch } from 'owa-locstrings/lib/strings/everythingselectedsearch.locstring.json';
import loc, { format } from 'owa-localize';

import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import { everythingSelected } from 'owa-locstrings/lib/strings/everythingselected.locstring.json';
import { everythingSelectedOther } from 'owa-locstrings/lib/strings/everythingselectedother.locstring.json';
import { someItemsSelected } from 'owa-locstrings/lib/strings/someitemsselected.locstring.json';
import { someConversationsSelected } from '../selectors/getItemsOrConversationsSelectedText.locstring.json';

// Returns the text for conversations or items strings in select all mode or virtual select all mode with an exclusion list.
// This is being used by the reading pane tab and reading pane. This also contains the logic of returning appropriate text
// in case of inbox plus scenario.
export default function getRowSelectionStringForSelectAll(
    isEverythingSelectedInTable: boolean,
    tableView: TableView,
    focusedFilter: FocusedViewFilter
): string {
    const { tableQuery, virtualSelectAllExclusionList, totalRowsInView } = tableView;

    if (isEverythingSelectedInTable) {
        if (focusedFilter !== FocusedViewFilter.None) {
            return focusedFilter === FocusedViewFilter.Focused
                ? loc(everythingSelectedFocused)
                : loc(everythingSelectedOther);
            // User is in search results
        }
        if (tableQuery.type == TableQueryType.Search) {
            return loc(everythingSelectedSearch);
            // User is in favorited category
        }
        if (getUserCategoryName(tableView)) {
            return format(loc(everythingSelected), getUserCategoryName(tableView));
        }
        // Everything in folder or favorited persona is selected
        const folder = folderStore.folderTable.get(tableQuery.folderId);
        return format(loc(everythingSelected), getEffectiveFolderDisplayName(folder));
    }
    // Only some rows are selected:
    // User selected all but then deselected some rows, return total item count - number of deselected items
    if (isInVirtualSelectionExclusionMode(tableView)) {
        const selectedRowsInVirtualSelectAllMode =
            totalRowsInView - virtualSelectAllExclusionList.length;

        return isConversationView(tableView)
            ? format(loc(someConversationsSelected), selectedRowsInVirtualSelectAllMode)
            : format(loc(someItemsSelected), selectedRowsInVirtualSelectAllMode);
    }
    //Ideally this would not come here, as we are calling this code either for select all mode or virtual select all with an exclusion list.
    // For code analysis, making this function return all items selected text.
    return loc(everythingSelectedSearch);
}
