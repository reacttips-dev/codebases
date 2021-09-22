import fetchUserMailboxInfoFromFolderId from './fetchUserMailboxInfoFromFolderId';
import { getUserMailboxInfo, MailboxInfo } from 'owa-client-ids';
import { isPublicFolder } from 'owa-folders';
import getGroupMailboxInfo from 'owa-group-common/lib/utils/getGroupMailboxInfo';
import { getGroupIdFromTableQuery } from 'owa-group-utils';
import type { TableQuery, TableView } from 'owa-mail-list-store';
import { getPublicFolderMailboxInfo } from 'owa-publicfolder-utils';
import type { MailboxRequestOptions } from 'owa-request-options-types';

export default function getMailboxInfo(tableView: TableView): MailboxInfo {
    if (tableView) {
        return getMailboxInfoFromTableQuery(tableView.tableQuery);
    }
    return getUserMailboxInfo();
}

export function getMailboxInfoFromTableQuery(tableQuery: TableQuery): MailboxInfo {
    const groupId = getGroupIdFromTableQuery(tableQuery);

    const folderId = tableQuery?.folderId;

    return groupId != null ? getGroupMailboxInfo(groupId) : getMailboxInfoFromFolderId(folderId);
}

export function getMailboxInfoFromFolderId(folderId: string): MailboxInfo {
    if (isPublicFolder(folderId)) {
        return getPublicFolderMailboxInfo(folderId);
    } else {
        return fetchUserMailboxInfoFromFolderId(folderId);
    }
}

export function getMailboxRequestOptionsFromTableQuery(
    tableQuery: TableQuery
): MailboxRequestOptions {
    const mailboxInfo = getMailboxInfoFromTableQuery(tableQuery);
    return {
        mailboxInfo: mailboxInfo,
    };
}
