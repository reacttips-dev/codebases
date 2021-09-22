import { action } from 'satcheljs';
import type { SortColumn } from 'owa-mail-list-store';
import type SortDirection from 'owa-service/lib/contract/SortDirection';

/**
 * Action to set folder sort by settings
 */
const setFolderSortBy = action(
    'setFolderSortBy',
    (folderId: string, sortColumn: SortColumn, sortDirection: SortDirection) => ({
        folderId: folderId,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
    })
);

export default setFolderSortBy;
