import { getMailboxFolderTreeData } from 'owa-folders';
import { getDefaultLogonEmailAddress } from 'owa-session-store';

/**
 * Selector for user emails of all the added shared folder users
 */
export function getSharedFolderUserEmails(userIdentity?: string): string[] {
    if (!userIdentity) {
        userIdentity = getDefaultLogonEmailAddress();
    }
    return getMailboxFolderTreeData(userIdentity).sharedFolderUserEmails;
}
