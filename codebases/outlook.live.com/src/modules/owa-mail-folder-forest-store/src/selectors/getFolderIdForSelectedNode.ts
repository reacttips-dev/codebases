import getSelectedNode from './getSelectedNode';
import {
    FavoritePersonaNode,
    FavoritePrivateDistributionListNode,
    FolderForestNodeType,
} from 'owa-favorites-types';

export default function getFolderIdForSelectedNode(): string {
    const selectedNode = getSelectedNode();
    switch (selectedNode.type) {
        case FolderForestNodeType.Persona:
            return (selectedNode as FavoritePersonaNode).searchFolderId;
        case FolderForestNodeType.PrivateDistributionList:
            return (selectedNode as FavoritePrivateDistributionListNode).data.searchFolderId;
        case FolderForestNodeType.Search:
            // Treat favorite search node the same as search, in that
            // it doesn't map to an actual folder Id
            return null;
        default:
            return selectedNode.id;
    }
}
