import type FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import type FolderTreeData from '../store/schema/FolderTreeData';
import type { MailFolder } from 'owa-graph-schema';
import getMailboxFolderTreeDataTable from '../selectors/getMailboxFolderTreeDataTable';
import { mutatorAction } from 'satcheljs';
/**
 *
 * @param id folder id
 * @param rootFolder rootFolder for this folder tree
 * @param loadingState the loading state of this folder tree
 * @param hasMoreData indicates if the folder hierarchy has more folders on server
 * @param currentLoadedIndex index of the last folder in the hierarchy on client
 * @param userIdentity identifies the account uniquely
 */
export const setFolderTreeData = mutatorAction(
    'setFolderTreeData',
    (
        id: string,
        rootFolder: MailFolder,
        loadingState: FolderTreeLoadStateEnum,
        hasMoreData: boolean = false,
        currentLoadedIndex: number = 0,
        userIdentity?: string
    ) => {
        const folderTreeData: FolderTreeData = {
            id: id,
            rootFolder: rootFolder,
            loadingState: loadingState,
            hasMoreData: hasMoreData,
            currentLoadedIndex: currentLoadedIndex,
        };

        getMailboxFolderTreeDataTable(userIdentity).set(id, folderTreeData);
    }
);
