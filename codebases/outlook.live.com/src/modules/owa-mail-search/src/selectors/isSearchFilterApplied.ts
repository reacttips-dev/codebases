import isDateRefinerApplied from './isDateRefinerApplied';
import isAttachmentsRefinerApplied from './isAttachmentsRefinerApplied';
import { getStore } from '../store/store';
import type { SearchTableQuery } from 'owa-mail-list-search';

export default function isSearchFilterApplied(searchTableQuery?: SearchTableQuery) {
    return (
        isAttachmentsRefinerApplied() ||
        isDateRefinerApplied() ||
        getStore().isUnread ||
        getStore().isToMe ||
        getStore().isFlagged ||
        getStore().isMentioned ||
        (!!searchTableQuery?.viewFilter && searchTableQuery?.viewFilter !== 'All')
    );
}
