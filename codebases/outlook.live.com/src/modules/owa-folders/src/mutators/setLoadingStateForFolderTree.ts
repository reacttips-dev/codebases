import { mutator } from 'satcheljs';
import type FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import { setLoadingStateForFolderTree } from '../actions/setLoadingStateForFolderTree';
import getMailboxFolderTreeDataTable from '../selectors/getMailboxFolderTreeDataTable';

/**
 * Mutator that sets the loading state for folder tree.
 */
export default mutator(setLoadingStateForFolderTree, actionMessage => {
    const { folderTreeId, userIdentity } = actionMessage;
    const loadingState: FolderTreeLoadStateEnum = actionMessage.loadingState;
    const folderTree = getMailboxFolderTreeDataTable(userIdentity).get(folderTreeId);
    folderTree.loadingState = loadingState;
});
