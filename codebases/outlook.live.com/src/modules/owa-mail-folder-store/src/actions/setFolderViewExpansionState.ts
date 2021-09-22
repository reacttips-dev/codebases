import { action } from 'satcheljs/lib/legacy';
import getFolderViewStateFromId from '../selectors/getFolderViewStateFromId';
import setFolderViewState from '../actions/setFolderViewState';

/*
 * Sets folder node expansion state
 * @param folderId the folder whose expansion state we are modifying
 * @param isExpanded the value to set for the expansion state
 */
export default action('setFolderViewExpansionState')(function setFolderViewExpansionState(
    folderId: string,
    isExpanded: boolean
): void {
    const viewState = getFolderViewStateFromId(folderId);
    if (viewState) {
        viewState.isExpanded = isExpanded;
        setFolderViewState(folderId, viewState);
    }
});
