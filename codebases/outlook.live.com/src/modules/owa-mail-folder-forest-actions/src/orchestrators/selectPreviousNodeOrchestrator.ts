import selectFavoriteCategory from '../actions/selectFavoriteCategory';
import selectFolder from '../actions/selectFolder';
import selectGroup from '../actions/selectGroup';
import selectPersona from '../actions/selectPersona';
import selectPrivateDistributionList from '../actions/selectPrivateDistributionList';
import { selectPreviousNode } from 'owa-mail-actions/lib/selectPreviousNode';
import { FolderForestNodeType } from 'owa-favorites-types';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { mailSearchStore } from 'owa-mail-search';
import type { ActionSource } from 'owa-mail-store';
import { createLazyOrchestrator } from 'owa-bundling';

export const selectPreviousNodeOrchestrator = createLazyOrchestrator(
    selectPreviousNode,
    'selectPreviousNodeClone',
    actionMessage => {
        const actionSource = actionMessage.actionSource as ActionSource;
        const searchStore = mailSearchStore;
        const previousNodeFromStore = searchStore.previousNode;

        // Select previous node if it was set, or the current selected node.
        // VSO #15945 - We should try to merge SelectFolder and SelectPersona logic.
        const folderNodeToSelect = previousNodeFromStore || getSelectedNode();
        switch (folderNodeToSelect.type) {
            case FolderForestNodeType.Persona:
                selectPersona(folderNodeToSelect.id);
                break;
            case FolderForestNodeType.PrivateDistributionList:
                selectPrivateDistributionList(folderNodeToSelect.id);
                break;
            case FolderForestNodeType.Folder:
            case FolderForestNodeType.PublicFolder:
                selectFolder(
                    folderNodeToSelect.id,
                    folderNodeToSelect.treeType,
                    actionSource,
                    folderNodeToSelect.type
                );
                break;
            case FolderForestNodeType.Category:
                selectFavoriteCategory(folderNodeToSelect.id);
                break;
            case FolderForestNodeType.Group:
                selectGroup(folderNodeToSelect.id, folderNodeToSelect.treeType);
                break;
            default:
                throw new Error('exitSearchOrchestrator: Unknown node type');
        }
    }
);
