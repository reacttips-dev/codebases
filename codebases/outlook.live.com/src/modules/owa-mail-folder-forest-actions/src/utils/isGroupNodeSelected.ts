import { getSelectedNode } from 'owa-mail-folder-forest-store';
import type { FolderForestTreeType } from 'owa-graph-schema';

export default function isGroupNodeSelected(
    groupId: string,
    treeType: FolderForestTreeType
): boolean {
    const selectedNode = getSelectedNode();
    return (
        selectedNode?.id &&
        selectedNode.treeType == treeType &&
        groupId.toLowerCase() == selectedNode.id.toLowerCase()
    );
}
