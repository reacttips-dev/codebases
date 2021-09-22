import type { IPoint } from '@fluentui/react/lib/Utilities';
import type { FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType } from 'owa-graph-schema';
import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import type { FolderContextMenuState } from '../store/schema/FolderContextMenuState';

/*
 * Sets state to spawn a context menu attached to a MailFolderList folder.
 */
export function showFolderTreeContextMenu(
    nodeId: string,
    nodeType: FolderForestNodeType,
    folderId: string,
    anchor: IPoint,
    treeType: FolderForestTreeType,
    rootNodeId?: string,
    showRootMenu?: boolean,
    distinguishedFolderParentIds?: string[]
): void {
    setFolderTreeContextMenu(
        {
            nodeId,
            nodeType,
            folderId,
            anchor,
            treeType,
            rootNodeId,
            showRootMenu,
            distinguishedFolderParentIds, // not populated for legacy code path
        },
        folderId
    );
}

/*
 * Sets state to close the context menu attached to a MailFolderList folder.
 */
export function hideFolderTreeContextMenu(): void {
    setFolderTreeContextMenu(null, null);
}

const setFolderTreeContextMenu = mutatorAction(
    'setFolderTreeContextMenu',
    (state: FolderContextMenuState | null, folderId: string | null) => {
        const viewStateStore = getStore();
        viewStateStore.contextMenuState = state;
        viewStateStore.withContextMenuFolderId = folderId;
    }
);
