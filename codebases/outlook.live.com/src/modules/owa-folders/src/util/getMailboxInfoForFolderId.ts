import { MailboxInfo, getUserMailboxInfo } from 'owa-client-ids';
import getFolderTable from '../selectors/getFolderTable';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { generateMailboxSmtpAddress } from './mailboxUtility';

/**
 * Fetches mailbox info for a given folder
 * @param folderId Id of the folder
 * @param routeToAuxIfAuxArchive whether to route the request to the the aux archive if the folder
 * belongs to aux archive mailbox (should only be false for some folder operations).
 */
export function getMailboxInfoForFolderId(
    folderId: string,
    routeToAuxIfAuxArchive: boolean
): MailboxInfo {
    const folderTable = getFolderTable();
    const folder = folderTable?.get(folderId);
    const sessionSettings = getUserConfiguration().SessionSettings;

    let mailboxSmtpAddress: string;
    let mailboxGuid; // set to archive mailbox for archive folders, null otherwise
    let auxArchiveMailboxGuid;
    let mailboxType;
    const userMailboxInfo = getUserMailboxInfo();

    if (folder?.mailboxInfo.type === 'SharedMailbox') {
        mailboxSmtpAddress = folder.mailboxInfo.mailboxSmtpAddress;
        mailboxType = 'SharedMailbox';
    } else if (
        folderId == ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID ||
        folderId == ARCHIVE_DUMPSTER_DISTINGUISHED_ID ||
        folder?.mailboxInfo.type == 'ArchiveMailbox'
    ) {
        // folderId check is required because when fetching the folder list for the archive, the root folder is not
        // yet present in the folder table
        auxArchiveMailboxGuid = folder?.ReplicaList?.[0];

        // Most requests should be routed to the mailbox the folder is in.
        // However, for folder operations on auxilliary archive folders,
        // the request always needs to go to the main archive mailbox.
        if (auxArchiveMailboxGuid && routeToAuxIfAuxArchive) {
            mailboxGuid = auxArchiveMailboxGuid;
        } else {
            mailboxGuid = sessionSettings.ArchiveMailboxGuid;
            auxArchiveMailboxGuid = undefined;
        }

        mailboxType = 'ArchiveMailbox';
        mailboxSmtpAddress = generateMailboxSmtpAddress(
            mailboxGuid,
            sessionSettings.OrganizationDomain
        );
    } else {
        // oneMailView - folder cleanup
        mailboxSmtpAddress = userMailboxInfo.mailboxSmtpAddress;
        mailboxType = 'UserMailbox';
    }

    return {
        type: mailboxType,
        userIdentity: userMailboxInfo.userIdentity,
        mailboxSmtpAddress: mailboxSmtpAddress,
        auxiliaryMailboxGuid: auxArchiveMailboxGuid,
    };
}
