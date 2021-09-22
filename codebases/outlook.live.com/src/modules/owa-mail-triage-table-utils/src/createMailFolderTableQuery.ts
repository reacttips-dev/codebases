import { getFindConversationShape, getFindItemShape } from 'owa-mail-find-rows';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import getSortByFolderId from 'owa-mail-folder-store/lib/selectors/getSortByFolderId';
import {
    MailFolderTableQuery,
    TableQuery,
    TableQueryType,
    SortBy,
    MailFolderScenarioType,
    isFavoritesSearchFolderScenario,
} from 'owa-mail-list-store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';

/**
 * Create the table query to load a mail folder
 * @param folderId the folderId
 * @param listViewType the list view type
 * @param scenarioType the type of scenario
 * @param focusedViewfilter the focusedViewfilter
 * @param viewFilter the viewFilter
 * @param categoryName the category name [this will have a value when create query for a category table]
 * @param sortBy the sortBy (column and direction)
 * @return tableQuery the tableQuery that needed to load a mail folder
 */
export default function createMailFolderTableQuery(
    folderId: string,
    listViewType: ReactListViewType,
    scenarioType: MailFolderScenarioType,
    focusedViewFilter?: FocusedViewFilter,
    viewFilter?: ViewFilter,
    categoryName?: string,
    sortBy?: SortBy
): TableQuery {
    const viewFilterToSet = viewFilter ? viewFilter : 'All';
    const sortByToSet = sortBy ? sortBy : getSortByFolderId(folderId);
    const focusedViewFilterToSet =
        focusedViewFilter == null
            ? getDefaultFocusedViewFilterForSelectedFolder(folderId)
            : focusedViewFilter;

    let requestShapeName;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            requestShapeName = getFindConversationShape(
                folderId,
                isFavoritesSearchFolderScenario(scenarioType)
            );
            break;

        case ReactListViewType.Message:
            requestShapeName = getFindItemShape();
            break;
    }

    const folderTableQuery: MailFolderTableQuery = {
        folderId: folderId,
        focusedViewFilter: focusedViewFilterToSet,
        listViewType: listViewType,
        viewFilter: viewFilterToSet,
        sortBy: sortByToSet,
        requestShapeName: requestShapeName,
        type: TableQueryType.Folder,
        categoryName: categoryName,
        scenarioType: scenarioType,
    };

    return folderTableQuery;
}

/**
 * Gets default FocusedViewFilter for selected folder
 * @param folderId of the folder
 */
function getDefaultFocusedViewFilterForSelectedFolder(folderId: string): FocusedViewFilter {
    const distinguishedFolder = folderIdToName(folderId);
    if (distinguishedFolder !== 'inbox') {
        // None if folder is not Inbox
        return FocusedViewFilter.None;
    }

    if (!isFocusedInboxEnabled()) {
        // None if Focused Inbox feature is not enabled for user
        return FocusedViewFilter.None;
    }

    return FocusedViewFilter.Focused;
}
