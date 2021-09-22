import type { FolderForestNode } from 'owa-favorites-types';
import folderForestStore from '../store/store';

export default function getSelectedNode(): FolderForestNode {
    return folderForestStore.selectedNode;
}
