import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { folderStore } from '../store/store';
import getPrimaryFolderTreeRootFolder from '../selectors/getPrimaryFolderTreeRootFolder';
import getFolderTable from '../selectors/getFolderTable';
import getArchiveFolderTreeRootFolder from '../selectors/getArchiveFolderTreeRootFolder';
import type { MailFolder, MailboxType } from 'owa-graph-schema';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import getSharedFolderRoot from '../selectors/getSharedFolderRoot';
import type FolderStore from '../store/schema/FolderStore';
import { getFoldersToShowFirst } from 'owa-folders-data-utils';

export function getFolderByDistinguishedId(
    distinguishedId: DistinguishedFolderIdName,
    principalSMTPAddress?: string
): MailFolder | undefined {
    const folderTable = getFolderTable();
    // Different (accounts) folders' distinguished-ids might be same ('Inbox' e.g.).
    // To support multi-accounts, add an additional Smtp address param to get correct folder id.
    if (principalSMTPAddress) {
        const folders = [...folderTable.values()].filter(
            folder =>
                folder.DistinguishedFolderId === distinguishedId &&
                folder.mailboxInfo.mailboxSmtpAddress === principalSMTPAddress
        );
        return folders[0];
    } else {
        const folderId = folderNameToId(distinguishedId);
        return folderId ? folderTable.get(folderId) : undefined;
    }
}

/**
 * get all child folders of a mailbox
 * @param rootFolder - root folder of a mailbox
 * @param principalSMTPAddress - email address of a shared folder
 * @return child folder ids of provided rootfolder id
 */
export function getMailRootFolderChildIds(
    mailboxType: MailboxType,
    principalSMTPAddress?: string
): string[] {
    // If someone wants to get child folders of a shared folder root,
    // then it must pass principalSMTPAddress OR throw error.
    if (mailboxType === 'SharedMailbox' && !principalSMTPAddress) {
        throw new Error('To get all the shared folders you must pass principalSMTPAddress');
    }
    let childFolderIds: string[] = [];
    let rootFolder: MailFolder;
    switch (mailboxType) {
        case 'ArchiveMailbox':
            rootFolder = getArchiveFolderTreeRootFolder(principalSMTPAddress);
            break;
        case 'SharedMailbox':
            rootFolder = getSharedFolderRoot(principalSMTPAddress);
            break;
        default:
            rootFolder = getPrimaryFolderTreeRootFolder(principalSMTPAddress);
    }

    const foldersToShowFirst = getFoldersToShowFirst();

    // First add all the special folders if mailbox is primary and moveto context is primary
    if (
        mailboxType == 'UserMailbox' &&
        rootFolder.DistinguishedFolderId ==
            getPrimaryFolderTreeRootFolder(principalSMTPAddress).DistinguishedFolderId &&
        rootFolder.FolderId // FolderId may be undefined if we fail to load data for folder hierarchy from session data.
    ) {
        const folders = foldersToShowFirst
            .map(distinguishedId =>
                getFolderByDistinguishedId(distinguishedId, principalSMTPAddress)
            )
            .filter(folder => folder?.ParentFolderId.Id === rootFolder.FolderId.Id);

        childFolderIds = principalSMTPAddress
            ? folders
                  .filter(folder => folder.mailboxInfo.mailboxSmtpAddress === principalSMTPAddress)
                  .map(folder => folder.FolderId.Id)
            : folders.map(folder => folder.FolderId.Id);
    }

    // Get child folder ids for root folder that can be displayed to user
    const childFolderIdsThatCanBeDisplayed = getfolderChildIdsThatCanBeDisplayed(
        rootFolder,
        principalSMTPAddress
    );

    // Add all the remaining folders that are not part of the special list above.
    for (let i = 0; i < childFolderIdsThatCanBeDisplayed.length; i++) {
        if (foldersToShowFirst.indexOf(folderIdToName(childFolderIdsThatCanBeDisplayed[i])) == -1) {
            childFolderIds.push(childFolderIdsThatCanBeDisplayed[i]);
        }
    }

    return childFolderIds;
}

/**
 * Identify child folders that can be displayed
 * @param folder - the folder whose displayable children are to be returned
 * @return - all displayable child folders of the parameter folder
 */
function getfolderChildIdsThatCanBeDisplayed(
    folder: MailFolder,
    principalSMTPAddress: string
): string[] {
    //Retrieve all child folder ids if primary smtp is not set, or grab only for the target account
    if (!folder?.childFolderIds) {
        return [];
    }

    const childFolders = folder.childFolderIds.map(childId => folderStore.folderTable.get(childId));
    const filteredChildFolders = principalSMTPAddress
        ? childFolders.filter(
              folder => folder.mailboxInfo.mailboxSmtpAddress === principalSMTPAddress
          )
        : childFolders;

    return filteredChildFolders.map(folder => folder.FolderId.Id);
}

/**
 * Function calculates and compares if the mailboxType of a given folder id is same as given mailboxType
 * @param mailboxType - mailboxType which needs to be checked
 * @param folderId - folderId
 */
export function isFolderInMailboxType(folderId: string, mailboxType: MailboxType): boolean {
    const folderTable = getFolderTable();
    const folder = folderTable.get(folderId);
    return folder?.mailboxInfo.type === mailboxType;
}

/**
 * Function returns folder mailbox type for the given folderId
 * @param folderId - folderId
 */
export function getMailboxTypeFromFolderId(
    folderId: string,
    folderStore: FolderStore
): MailboxType {
    const folder = folderStore.folderTable.get(folderId);
    if (folder) {
        return folder.mailboxInfo.type;
    }
    return null;
}
