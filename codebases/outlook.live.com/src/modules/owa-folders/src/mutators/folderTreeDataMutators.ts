import { mutator, orchestrator } from 'satcheljs';
import { initializeArchiveFolderTreeFromSessionData } from '../actions/publicActions';
import type { MailFolder } from 'owa-graph-schema';
import { ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';
import { getUserConfiguration } from 'owa-session-store';
import getMailboxFolderTreeDataTable from '../selectors/getMailboxFolderTreeDataTable';
import { removeFolderTreeData } from '../actions/removeFolderTreeData';
import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import { setFolderTreeData } from './setFolderTreeData';
import { getUserMailboxInfo } from 'owa-client-ids';

/**
 * Initializes the archive mailbox folder tree.
 */
orchestrator(initializeArchiveFolderTreeFromSessionData, () => {
    // Initialize the archive root folder using the data received in session data such as display name and set it in the store.
    const folder = <MailFolder>{
        DistinguishedFolderId: ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
        DisplayName: getUserConfiguration().SessionSettings.ArchiveDisplayName,
        mailboxInfo: {
            type: 'ArchiveMailbox',
            mailboxSmtpAddress: getUserConfiguration().SessionSettings.ArchiveMailboxGuid,
            userIdentity: getUserMailboxInfo().userIdentity,
        },
    };

    // update the archive folder tree root and loading state.
    setFolderTreeData(
        ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
        folder,
        FolderTreeLoadStateEnum.Uninitialized
    );
});

mutator(removeFolderTreeData, actionMessage => {
    getMailboxFolderTreeDataTable(actionMessage.userIdentity).delete(actionMessage.folderTreeId);
});
