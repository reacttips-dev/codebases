import type { MailboxFolderTreeData } from './schema/FolderStore';
import { ObservableMap } from 'mobx';
import { PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';
import type FolderTreeData from './schema/FolderTreeData';
import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import type { MailFolder } from 'owa-graph-schema';
import { getUserMailboxInfo } from 'owa-client-ids';

/**
 * Gets the default mailbox folder tree data that is initialized to hold data for primary folder tree
 */
export function getDefaultMailboxFolderTreeData(userIdentity?: string): MailboxFolderTreeData {
    return {
        folderTreeTable: new ObservableMap<string, FolderTreeData>({
            [PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID]: {
                id: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
                rootFolder: <MailFolder>{
                    DistinguishedFolderId: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
                    DisplayName: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
                    mailboxInfo: getUserMailboxInfo(userIdentity),
                },
                loadingState: FolderTreeLoadStateEnum.Uninitialized,
            },
        }),
        sharedFolderUserEmails: [],
    };
}
