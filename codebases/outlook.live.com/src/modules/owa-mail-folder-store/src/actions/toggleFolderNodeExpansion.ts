import { action } from 'satcheljs/lib/legacy';
import { updateFolderViewState } from './folderViewStatesActions';
import getFolderViewStateFromId from '../selectors/getFolderViewStateFromId';
import setFolderViewState from '../actions/setFolderViewState';

/**
 * Expands or collapses the folder
 * @param folderId - unique identifier id for a folder
 * @param doNotPersistUserConfig - should user config be updated or not
 */
export default action('toggleFolderNodeExpansion')(function (
    folderId: string,
    doNotPersistUserConfig?: boolean
): void {
    const localViewState = getFolderViewStateFromId(folderId);
    if (localViewState) {
        localViewState.isExpanded = !localViewState.isExpanded;
        setFolderViewState(folderId, localViewState);
    }

    // User config is not persistent for Archive mailbox, hence we need not call this action in that case
    if (!doNotPersistUserConfig) {
        updateFolderViewState(folderId);
    }
});
