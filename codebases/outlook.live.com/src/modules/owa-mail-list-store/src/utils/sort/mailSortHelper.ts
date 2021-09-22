import type MailFolderTableQuery from '../../store/schema/MailFolderTableQuery';
import SortBy, { SortColumn } from '../../store/schema/SortBy';
import TableQuery, { TableQueryType } from '../../store/schema/TableQuery';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type SortDirection from 'owa-service/lib/contract/SortDirection';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

export const DESCENDING_SORT_DIR: SortDirection = 'Descending';
export const ASCENDING_SORT_DIR: SortDirection = 'Ascending';
export const DEFAULT_SORT_COLUMN: SortColumn = SortColumn.Date;

/**
 * Gets the SortBy that supports Pin
 */
export function getSortBySupportingPin(): SortBy {
    return {
        sortColumn: SortColumn.Date,
        sortDirection: DESCENDING_SORT_DIR,
    };
}

/**
 * Gets the list of supported sort columns
 * @param folderId for which to return the sort columns
 */
export function getSupportedSortColumns(folderId: string) {
    const isSentOrDraftsFolder =
        folderNameToId('sentitems') == folderId || folderNameToId('drafts') == folderId;
    if (isSentOrDraftsFolder) {
        return [SortColumn.Date, SortColumn.Size];
    } else {
        return [
            SortColumn.Date,
            SortColumn.From,
            SortColumn.Size,
            SortColumn.Importance,
            SortColumn.Subject,
        ];
    }
}

/**
 * Gets the default sortDirection for the given sortColumn
 * @param sortColumn sortColumn for which to get the default sort direction
 * @returns the sortDirection
 */
export function getDefaultSortDirectionForSortColumn(sortColumn: SortColumn): SortDirection {
    switch (sortColumn) {
        case SortColumn.Date:
        case SortColumn.Size:
        case SortColumn.Importance:
            return DESCENDING_SORT_DIR;

        case SortColumn.From:
        case SortColumn.Subject:
            return ASCENDING_SORT_DIR;

        default:
            throw new Error('getDefaultSortDirectionForSortColumn: sortColumn not supported');
    }
}

/**
 * Gets the default sortBy property
 * @returns returns the default sortBy property
 */
export function getDefaultSortBy(): SortBy {
    return {
        sortColumn: DEFAULT_SORT_COLUMN,
        sortDirection: getDefaultSortDirectionForSortColumn(DEFAULT_SORT_COLUMN),
    };
}

/**
 * Gets a flag indicating whether the given tableQuery is multi-value sorted
 * @param tableQuery tableQuery to check if multi-value sorted
 * @return flag indicating whether the given tableQuery is multi-value sorted
 */
export function isTableMultiValueSort(tableQuery: TableQuery): boolean {
    const tableSortColumn =
        tableQuery.type == TableQueryType.Folder &&
        (tableQuery as MailFolderTableQuery).sortBy.sortColumn;
    return (
        tableSortColumn &&
        tableQuery.listViewType == ReactListViewType.Conversation &&
        tableSortColumn == SortColumn.From
    );
}
