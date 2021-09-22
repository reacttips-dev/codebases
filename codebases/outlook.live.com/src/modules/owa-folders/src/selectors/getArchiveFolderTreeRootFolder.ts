import type { MailFolder } from 'owa-graph-schema';
import getRootFolderForFolderTree from './getRootFolderForFolderTree';
import { ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';

/**
 * Archive mailbox folder tree root folder selector
 * @param userIdentity identifies the mailbox uniquely
 */
export default function getArchiveFolderTreeRootFolder(userIdentity?: string): MailFolder {
    return getRootFolderForFolderTree(ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID, userIdentity);
}
