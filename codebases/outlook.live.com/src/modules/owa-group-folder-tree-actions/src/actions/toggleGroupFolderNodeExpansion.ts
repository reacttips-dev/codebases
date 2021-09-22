import { action } from 'satcheljs/lib/legacy';
import { groupListNodesViewStateStore } from 'owa-group-left-nav-folders-store';

/**
 * Expands or collapses the group folder
 * @param groupId - smtp address of a group
 * @param folderId - Id of the group folder
 */
export default action('toggleGroupFolderNodeExpansion')(function (
    groupId: string,
    folderId: string
): void {
    const groupFolderViewState = groupListNodesViewStateStore.groupListNodesViewStates
        .get(groupId)
        ?.groupFolderNodeViewStates.get(folderId);
    if (groupFolderViewState) {
        groupFolderViewState.isExpanded = !groupFolderViewState.isExpanded;
    }
});
