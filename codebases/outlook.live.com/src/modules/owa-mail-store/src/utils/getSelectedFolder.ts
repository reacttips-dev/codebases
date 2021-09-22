import {
    FavoritePersonaNode,
    FavoritePrivateDistributionListNode,
    FolderForestNodeType,
} from 'owa-favorites-types';
import folderStore from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import { getSelectedNode } from 'owa-mail-folder-forest-store';

export default function getSelectedFolder(): MailFolder {
    const selectedNode = getSelectedNode();
    let selectedFolderId = null;

    if (selectedNode.type === FolderForestNodeType.Persona) {
        selectedFolderId = (selectedNode as FavoritePersonaNode).searchFolderId;
    } else if (selectedNode.type === FolderForestNodeType.PrivateDistributionList) {
        selectedFolderId = (selectedNode as FavoritePrivateDistributionListNode).data
            .searchFolderId;
    } else {
        selectedFolderId = selectedNode.id;
    }

    return selectedFolderId == null ? null : folderStore.folderTable.get(selectedFolderId);
}
