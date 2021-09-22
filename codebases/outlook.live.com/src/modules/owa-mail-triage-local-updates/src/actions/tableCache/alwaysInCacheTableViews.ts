import {
    set as setInAlwaysInCacheList,
    clear as clearFromAlwaysInCacheList,
} from './alwaysInCacheTableIdList';
import { allowMultipleSortCaching } from './allowMultipleSortCaching';
import { getFolderChangeDigestAction } from 'owa-mail-focused-inbox-rollup-store';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';
import {
    getNonFocusedInboxTableQuery,
    getFocusedInboxTableQuery,
    getOtherInboxTableQuery,
} from 'owa-mail-triage-table-utils/lib/getDefaultInboxTableQueries';
import {
    getViewFilterForTable,
    MailFolderTableQuery,
    SortBy,
    TableView,
} from 'owa-mail-list-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import getSortByFolderId from 'owa-mail-folder-store/lib/selectors/getSortByFolderId';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export const FOCUSED_INBOX = 'FOCUSED';
export const OTHER_INBOX = 'OTHER';
export const ALL_INBOX = 'ALL';

let currentSortBy: SortBy | undefined;
let currentIsFocusedInboxEnabled: boolean | undefined;
let currentListViewType: ReactListViewType | undefined;

/**
 * Reset the always in cache inbox table views
 */
export function initializeAlwaysInCacheTableViews() {
    updateAlwaysInCacheTableViewsToSort(currentSortBy, currentListViewType);
}

/**
 * If the view passed in belongs in the always table, reset the cached table views
 */
export function tryUpdateAlwaysInCacheTableViews(tableView: TableView): boolean {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;

    // Only cache Inbox with All filter
    if (
        tableView.tableQuery.folderId === folderNameToId('inbox') &&
        getViewFilterForTable(tableView) === 'All' &&
        mailTableQuery.scenarioType !== 'spotlight'
    ) {
        let sortBy = mailTableQuery.sortBy;

        if (allowMultipleSortCaching()) {
            // Checks the sort preferences of inbox and only stores the default sorts in the always table
            const folderSettingsSortBy = getSortByFolderId(tableView.tableQuery.folderId);
            if (
                sortBy.sortColumn === folderSettingsSortBy.sortColumn &&
                sortBy.sortDirection === folderSettingsSortBy.sortDirection
            ) {
                updateAlwaysInCacheTableViewsToSort(undefined, tableView.tableQuery.listViewType);
                return true;
            }
        } else {
            // Caches the table regardless of whether it's a default sort or not, always keep a single sort
            updateAlwaysInCacheTableViewsToSort(sortBy, tableView.tableQuery.listViewType);
            return true;
        }
    }

    return false;
}

/**
 * Reset the always in cache inbox table views to a specific sort
 */
function updateAlwaysInCacheTableViewsToSort(
    sortBy: SortBy | undefined,
    listViewType: ReactListViewType | undefined
) {
    const newIsFocusedInboxEnabled = isFocusedInboxEnabled();

    // If the current tables cached match what's desired then nothing to do
    if (
        sortBy &&
        currentSortBy &&
        sortBy.sortDirection === currentSortBy.sortDirection &&
        sortBy.sortColumn === currentSortBy.sortColumn &&
        currentIsFocusedInboxEnabled == newIsFocusedInboxEnabled &&
        currentListViewType === listViewType
    ) {
        return;
    }

    updateTo(newIsFocusedInboxEnabled, sortBy);

    currentSortBy = sortBy;
    currentIsFocusedInboxEnabled = newIsFocusedInboxEnabled;
    currentListViewType = listViewType;
}

function updateTo(isFocusedInbox: boolean, sortBy: SortBy | undefined) {
    const forceReplacement = !allowMultipleSortCaching();

    if (isFocusedInbox) {
        const focusedTableQuery = getFocusedInboxTableQuery();
        const otherTableQuery = getOtherInboxTableQuery();
        if (sortBy !== undefined) {
            focusedTableQuery.sortBy = sortBy;
            otherTableQuery.sortBy = sortBy;
        }

        // Add focused other table and remove non-focused inbox
        setInAlwaysInCacheList(FOCUSED_INBOX, focusedTableQuery, forceReplacement);
        setInAlwaysInCacheList(OTHER_INBOX, otherTableQuery, forceReplacement);
        clearFromAlwaysInCacheList(ALL_INBOX);

        // VSO 13075: Read focused/other rollup data from session data response on boot
        // Making this additional request to get folder change digest for now
        getFolderChangeDigestAction(otherTableQuery);
    } else {
        const nonFocusedTableQuery = getNonFocusedInboxTableQuery();
        if (sortBy !== undefined) {
            nonFocusedTableQuery.sortBy = sortBy;
        }

        // Remove focused other table and add non-focused inbox
        clearFromAlwaysInCacheList(FOCUSED_INBOX);
        clearFromAlwaysInCacheList(OTHER_INBOX);
        setInAlwaysInCacheList(ALL_INBOX, nonFocusedTableQuery, forceReplacement);
    }
}
