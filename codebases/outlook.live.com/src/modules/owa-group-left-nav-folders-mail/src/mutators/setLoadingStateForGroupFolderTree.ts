import { mutator } from 'satcheljs';
import { setLoadingStateForGroupFolderTree } from 'owa-group-folder-tree-actions';
import {
    GroupFolderTreeLoadStateEnum,
    leftNavGroupFoldersStore,
} from 'owa-group-left-nav-folders-store';

/**
 * Mutator that sets the folder hierarchy loading state of a group.
 */
export default mutator(setLoadingStateForGroupFolderTree, actionMessage => {
    const groupId = actionMessage.groupId;
    const loadingState: GroupFolderTreeLoadStateEnum = actionMessage.loadingState;
    const folderHierarchy = leftNavGroupFoldersStore.folderTable?.get(groupId.toLowerCase());
    if (folderHierarchy) {
        folderHierarchy.loadingState = loadingState;
    }
});
