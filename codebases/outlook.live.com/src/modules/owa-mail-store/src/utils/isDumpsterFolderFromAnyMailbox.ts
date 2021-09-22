import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';
import {
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';

/**
 * Utility to check whether a folder is dumpster folder for any mailbox
 * @param folderId - the folderId.Id property of the folder
 * VSO - 108968 - [Clean up] Remove isDumpsterFolderFromAnyMailbox and use V2 based on DistinguishedFolderId
 */
export default function isDumpsterFolderFromAnyMailbox(folderId: string) {
    return (
        folderId &&
        (doesFolderIdEqualName(folderId, PRIMARY_DUMPSTER_DISTINGUISHED_ID) ||
            doesFolderIdEqualName(folderId, ARCHIVE_DUMPSTER_DISTINGUISHED_ID))
    );
}
