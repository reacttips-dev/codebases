import { MailFolderTableQuery, MailSortHelper, TableQueryType } from 'owa-mail-list-store';
import { getFindItemShape, FindConversationShapeName } from 'owa-mail-find-rows';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

/**
 * Create the table query to load group mail
 * @param groupId the groupId (group smtp address)
 * @param listViewType the list view type
 * @return tableQuery the tableQuery that needed to load group mail
 */
export default function createGroupMailTableQuery(
    groupId: string,
    listViewType: ReactListViewType
): MailFolderTableQuery {
    let requestShapeName;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            requestShapeName = FindConversationShapeName;
            break;

        case ReactListViewType.Message:
            requestShapeName = getFindItemShape();
            break;
    }

    const groupMailTableQuery: MailFolderTableQuery = {
        categoryName: null,
        folderId: groupId,
        focusedViewFilter: FocusedViewFilter.None,
        listViewType: listViewType,
        viewFilter: 'All',
        sortBy: MailSortHelper.getDefaultSortBy(),
        requestShapeName: requestShapeName,
        type: TableQueryType.Group,
        scenarioType: 'group',
    };

    return groupMailTableQuery;
}
