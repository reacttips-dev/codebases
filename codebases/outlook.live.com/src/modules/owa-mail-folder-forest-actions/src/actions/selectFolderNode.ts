import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import type { ActionSource } from 'owa-mail-store';
import { action } from 'satcheljs/lib/legacy';
import {
    lazySelectPersona,
    lazySelectPrivateDistributionList,
    lazySelectFavoriteCategory,
    selectFolder,
    lazySelectGroup,
} from '../index';

/**
 * Selects the folder node
 * @param folderNode - the folder node to select
 * @param actionSource - the source that initiated the action
 */
export default action('selectFolderNode')(function selectFolderNode(
    folderNode: FolderForestNode,
    actionSource: ActionSource
): void {
    // VSO - #15945 - We should try to merge SelectFolder and SelectPersona logic
    const folderNodeToSelect = folderNode || getSelectedNode();
    switch (folderNodeToSelect.type) {
        case FolderForestNodeType.Persona:
            lazySelectPersona.importAndExecute(folderNodeToSelect.id);
            break;
        case FolderForestNodeType.PrivateDistributionList:
            lazySelectPrivateDistributionList.importAndExecute(folderNodeToSelect.id);
            break;
        case FolderForestNodeType.Folder:
            selectFolder(folderNodeToSelect.id, folderNodeToSelect.treeType, actionSource);
            break;
        case FolderForestNodeType.Category:
            lazySelectFavoriteCategory.importAndExecute(folderNodeToSelect.id);
            break;
        case FolderForestNodeType.Group:
            lazySelectGroup.importAndExecute(folderNodeToSelect.id, folderNodeToSelect.treeType);
            break;
        default:
            throw new Error('selectFolderNode: Unknown node type');
    }
});
