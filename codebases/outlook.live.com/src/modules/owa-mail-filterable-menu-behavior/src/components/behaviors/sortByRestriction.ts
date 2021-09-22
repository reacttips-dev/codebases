import { xor } from './utils/xor';
import {
    getSelectedTableView,
    TableQueryType,
    MailFolderTableQuery,
    SortBy,
} from 'owa-mail-list-store';

export const sortByRestriction = (sortings: SortBy[], shouldHide?: boolean) => () => {
    const {
        tableQuery,
        tableQuery: { type },
    } = getSelectedTableView();

    let isSortByInRestrictionList = false;
    if (type == TableQueryType.Folder || type == TableQueryType.Group) {
        const tableSortBy = (tableQuery as MailFolderTableQuery).sortBy;
        isSortByInRestrictionList = sortings.some(({ sortColumn, sortDirection }) => {
            return (
                sortColumn == tableSortBy.sortColumn && sortDirection == tableSortBy.sortDirection
            );
        });
    } else {
        isSortByInRestrictionList = true;
    }

    return xor(shouldHide, isSortByInRestrictionList);
};
