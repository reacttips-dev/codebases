import type { MailFolder } from 'owa-graph-schema';
import getRootFolderForFolderTree from './getRootFolderForFolderTree';
import { PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';

/**
 * Primary folder tree root folder selector
 * @param userIdentity user smtp address for which to fetch the primary folder tree root folder
 */
export default function getPrimaryFolderTreeRootFolder(userIdentity?: string): MailFolder {
    return getRootFolderForFolderTree(PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID, userIdentity);
}
