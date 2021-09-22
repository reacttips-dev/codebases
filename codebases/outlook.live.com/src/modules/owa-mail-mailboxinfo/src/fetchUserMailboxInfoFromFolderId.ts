import { MailboxInfo, getUserMailboxInfo } from 'owa-client-ids';
import { getMailboxInfoForFolderId } from 'owa-folders';

const cachedMailboxInfo: Map<string, MailboxInfo> = new Map();

/**
 * Utility which returns user mailbox info as per folder id
 * @param folderId folder for which to fetch mailbox info
 */
export default function fetchUserMailboxInfoFromFolderId(folderId: string): MailboxInfo {
    // Return request options as default mailbox info if folderId is not present
    if (!folderId) {
        return getUserMailboxInfo();
    }

    // Save recomputation by storing the request options in a map per folder
    if (!cachedMailboxInfo.has(folderId)) {
        let mailboxInfo = getMailboxInfoForFolderId(folderId, true /* routeToAuxIfAuxArchive */);
        cachedMailboxInfo.set(folderId, mailboxInfo);
    }

    return cachedMailboxInfo.get(folderId);
}
