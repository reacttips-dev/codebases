import { action } from 'satcheljs';
import type FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';

/**
 * Action to set loading state for folder tree in particular mailbox.
 */
export const setLoadingStateForFolderTree = action(
    'SET_LOADING_STATE_FOR_FOLDER_TREE',
    (folderTreeId: string, loadingState: FolderTreeLoadStateEnum, userIdentity?: string) => ({
        folderTreeId,
        loadingState,
        userIdentity,
    })
);
