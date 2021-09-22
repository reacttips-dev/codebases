import type { IPoint } from '@fluentui/react/lib/Utilities';
import type { FolderForestNodeType } from 'owa-favorites-types';
import { mutatorAction } from 'satcheljs';
import mailFavoritesStore from '../store/store';
import type { FolderContextMenuState } from 'owa-mail-folder-store/lib/store/schema/FolderContextMenuState';

/*
 * Sets state to spawn a context menu attached to a favorite node.
 */
export function showFavoritesContextMenu(
    nodeId: string,
    nodeType: FolderForestNodeType,
    anchor: IPoint,
    folderId?: string
): void {
    setContextMenuState({
        nodeId,
        nodeType,
        folderId,
        anchor,
        treeType: 'favorites',
    });
}

export const setContextMenuState = mutatorAction(
    'setContextMenuState',
    (state: FolderContextMenuState | null) => {
        mailFavoritesStore.mailFavoritesViewState.contextMenuState = state;
    }
);
