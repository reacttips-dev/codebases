import createMailFolderTableQuery from './createMailFolderTableQuery';
import { getCategoryNameFromId, getMasterCategoryList } from 'owa-categories';
import { TableQuery } from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

/**
 * Create the table query to load a category search folder
 * @param categoryId the id of the category
 * @return tableQuery the tableQuery that needed to load a mail folder
 */
export default function createMailCategoryFolderTableQuery(categoryId: string): TableQuery {
    const categoryName = getCategoryNameFromId(categoryId, getMasterCategoryList());
    const mailCategoryTableQuery = createMailFolderTableQuery(
        folderNameToId('msgfolderroot'),
        getListViewTypeForFolder(null),
        'category',
        FocusedViewFilter.None,
        'UserCategory',
        categoryName
    );

    return mailCategoryTableQuery;
}
