import type { MailFolder } from 'owa-graph-schema';
import getMailboxFolderTreeDataTable from './getMailboxFolderTreeDataTable';

/**
 * Selector for a particular mailbox folder tree root folder
 * @param folderTreeIdentifier identifies the tree uniquely (primary \archive \ shared)
 * @param userIdentity identifies the mailbox uniquely
 */
export default function getRootFolderForFolderTree(
    folderTreeIdentifier: string,
    userIdentity?: string
): MailFolder {
    const mailboxFolderTreeDataTable = getMailboxFolderTreeDataTable(userIdentity);
    const folderTreeData =
        mailboxFolderTreeDataTable && mailboxFolderTreeDataTable.get(folderTreeIdentifier);
    return folderTreeData?.rootFolder;
}
