import type { MailFolder } from 'owa-graph-schema';
import getRootFolderForFolderTree from './getRootFolderForFolderTree';

/**
 * Shared folders root folder selector for a given user
 */
export default function getSharedFolderRoot(principalSMTPAddress: string): MailFolder {
    return getRootFolderForFolderTree(principalSMTPAddress);
}
