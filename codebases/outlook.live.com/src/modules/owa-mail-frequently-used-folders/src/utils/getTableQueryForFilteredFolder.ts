import type { FilteredFolderFilterProperties } from '../types/FilteredFolderFilterProperties';
import type { TableQuery } from 'owa-mail-list-store';
import { getCategoryIdFromName, getMasterCategoryList } from 'owa-categories';
import createMailCategoryFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailCategoryFolderTableQuery';

export function getTableQueryForFilteredFolder(
    filteredFolderFilterProps: FilteredFolderFilterProperties
): TableQuery {
    if (filteredFolderFilterProps.filterType != 'UserCategory') {
        throw new Error(
            "getQueryTypeForFilteredFolder should only be called for 'UserCategory' viewfilter type"
        );
    }

    const categoryId = getCategoryIdFromName(
        filteredFolderFilterProps.filterValue,
        getMasterCategoryList()
    );

    // The category might have been deleted from master category list when trying to prefetch
    // VSO 30372: update FUF list when a folder/category is deleted
    if (!categoryId) {
        return null;
    }

    return createMailCategoryFolderTableQuery(categoryId);
}
