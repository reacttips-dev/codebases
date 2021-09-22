import {
    noConversationsSelected,
    oneConversationSelected,
    someConversationsSelected,
} from './getItemsOrConversationsSelectedText.locstring.json';
import {
    noItemsSelected,
    oneItemSelected,
    someItemsSelected,
} from 'owa-locstrings/lib/strings/someitemsselected.locstring.json';
import loc, { format } from 'owa-localize';
import listViewStore from '../store/Store';
import getIsEverythingSelectedInTable from './getIsEverythingSelectedInTable';
import isItemPartOperation from './isItemPartOperation';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getFocusedFilterForTable from '../utils/getFocusedFilterForTable';
import { getRowSelectionStringForSelectAll, isInVirtualSelectionExclusionMode } from '../index';

export default function getItemsOrConversationsSelectedText(tableViewId: string): string {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const focusedFilter = getFocusedFilterForTable(tableView);
    const { tableQuery, selectedRowKeys } = tableView;

    const isEverythingSelectedInTable = getIsEverythingSelectedInTable(tableView);
    // User is in select all mode or in virtual select mode with an exclusion list
    if (isEverythingSelectedInTable || isInVirtualSelectionExclusionMode(tableView)) {
        return getRowSelectionStringForSelectAll(
            isEverythingSelectedInTable,
            tableView,
            focusedFilter
        );
    }

    // User has selected a specific number of rows or row parts
    const numSelections = isItemPartOperation()
        ? listViewStore.expandedConversationViewState.selectedNodeIds.length
        : selectedRowKeys.size;
    if (tableQuery.listViewType == ReactListViewType.Message || isItemPartOperation()) {
        // Designate string for rows
        if (numSelections === 0) {
            return loc(noItemsSelected);
        } else if (numSelections === 1) {
            return loc(oneItemSelected);
        }
        return format(loc(someItemsSelected), numSelections);
    }
    // Designate string for conversations
    if (numSelections === 0) {
        return loc(noConversationsSelected);
    } else if (numSelections === 1) {
        return loc(oneConversationSelected);
    }
    return format(loc(someConversationsSelected), numSelections);
}
