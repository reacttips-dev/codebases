import { action } from 'satcheljs';
import type { GroupFolderTreeLoadStateEnum } from 'owa-group-left-nav-folders-store';

/**
 * Action to set loading state for group folder tree.
 */
export const setLoadingStateForGroupFolderTree = action(
    'SET_LOADING_STATE_FOR_GROUP_FOLDER_TREE',
    (groupId: string, loadingState: GroupFolderTreeLoadStateEnum) => ({
        groupId,
        loadingState,
    })
);
