import getSortByFolderId from 'owa-mail-folder-store/lib/selectors/getSortByFolderId';
import createMailFolderTableQuery from './createMailFolderTableQuery';
import { MailFolderTableQuery } from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';

/**
 * Gets the tableQuery for regular (non-focused) inbox view
 */
export function getNonFocusedInboxTableQuery(): MailFolderTableQuery {
    const inboxFolderId = folderNameToId('inbox');
    const inboxListViewType = getListViewTypeForFolder(inboxFolderId);
    const sortByFolderId = getSortByFolderId(inboxFolderId);

    const tableQuery = createMailFolderTableQuery(
        inboxFolderId,
        inboxListViewType,
        'mail',
        FocusedViewFilter.None,
        null /* viewFilter */,
        null /* categoryName */,
        sortByFolderId
    );

    return tableQuery as MailFolderTableQuery;
}

/**
 * Gets the tableQuery for focused inbox view
 */
export function getFocusedInboxTableQuery(): MailFolderTableQuery {
    let tableQuery = getNonFocusedInboxTableQuery();
    tableQuery.focusedViewFilter = FocusedViewFilter.Focused;
    return tableQuery;
}

/**
 * Gets the tableQuery for other inbox view
 */
export function getOtherInboxTableQuery(): MailFolderTableQuery {
    let tableQuery = getNonFocusedInboxTableQuery();
    tableQuery.focusedViewFilter = FocusedViewFilter.Other;
    return tableQuery;
}

/**
 * Gets the tableQuery for user's current Inbox configuration
 */
export function getDefaultInboxTableQuery(): MailFolderTableQuery {
    if (isFocusedInboxEnabled()) {
        return getFocusedInboxTableQuery();
    }

    return getNonFocusedInboxTableQuery();
}
