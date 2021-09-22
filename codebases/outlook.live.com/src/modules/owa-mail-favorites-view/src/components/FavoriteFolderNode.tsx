import { observer } from 'mobx-react-lite';
import type { FavoriteNodeCommonProps } from './FavoriteNode';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { getStore as getFavoritesStore, lazyUpdateFavoritePosition } from 'owa-favorites';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import { lazyAddFavoriteFolder } from 'owa-mail-favorites-store';
import { showFavoritesContextMenu } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import { getCustomIcon } from 'owa-folders-common';
import getFolderViewStateFromId from 'owa-mail-folder-store/lib/selectors/getFolderViewStateFromId';
import type MailFolderDragData from 'owa-mail-folder-store/lib/store/schema/MailFolderDragData';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET, FolderNode } from 'owa-mail-folder-view';
import { listViewStore } from 'owa-mail-list-store';
import * as lazyTriageActions from 'owa-mail-triage-action';
import type { MailListItemPartDragData } from 'owa-mail-types/lib/types/MailListItemPartDragData';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import { getAnchorForContextMenu } from 'owa-positioning';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import * as React from 'react';

import styles from './FavoriteNode.scss';

export interface FavoriteFolderNodeProps extends FavoriteNodeCommonProps {
    folderId: string;
    favoriteId: string;
    isPublicFolder?: boolean;
}

export default observer(function FavoriteFolderNode(props: FavoriteFolderNodeProps) {
    // Besides the isDragOver property in store, we also add this property here to distinguish from the dropping on MailFolderNode
    const isDragOver = React.useRef<boolean>();
    const getFolder = (): MailFolder => {
        if (props.isPublicFolder) {
            return publicFolderFavoriteStore.folderTable.get(props.folderId);
        }
        return folderStore.folderTable.get(props.folderId);
    };
    const onContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        showFavoritesContextMenu(
            props.favoriteId,
            props.isPublicFolder ? FolderForestNodeType.PublicFolder : FolderForestNodeType.Folder,
            getAnchorForContextMenu(evt),
            props.folderId
        );
    };
    const onDrop = async (dragData: DragData) => {
        const itemType = dragData.itemType;
        switch (itemType) {
            case DraggableItemTypes.MailListItemPart:
                {
                    const mailListItemPartDragData = dragData as MailListItemPartDragData;
                    const tableView = listViewStore.tableViews.get(
                        mailListItemPartDragData.tableViewId
                    );
                    const moveItemsBasedOnNodeIds = await lazyTriageActions.lazyMoveItemsBasedOnNodeIds.import();
                    moveItemsBasedOnNodeIds(
                        mailListItemPartDragData.nodeIds,
                        props.folderId,
                        tableView.id,
                        'Drag'
                    );
                }
                break;
            case DraggableItemTypes.MailListRow:
            case DraggableItemTypes.MultiMailListConversationRows:
            case DraggableItemTypes.MultiMailListMessageRows:
                {
                    const mailListRowDragData = dragData as MailListRowDragData;
                    const tableViewId = mailListRowDragData.tableViewId;
                    const rowKeys = mailListRowDragData.rowKeys;
                    lazyTriageActions.lazyMoveMailListRows.importAndExecute(
                        rowKeys,
                        props.folderId,
                        tableViewId,
                        'Drag'
                    );
                }
                break;
            case DraggableItemTypes.MailFolderNode:
                {
                    const mailFolderItemBeingDragged = dragData as MailFolderDragData;
                    const draggedFolderId = mailFolderItemBeingDragged.folderId;
                    const dropTargetId = props.favoriteId;
                    const newIndex = getFavoritesStore().orderedOutlookFavoritesIds.indexOf(
                        dropTargetId
                    );
                    const addFavoriteFolder = await lazyAddFavoriteFolder.import();
                    addFavoriteFolder(draggedFolderId, 'Drag', newIndex);
                }
                break;
            case DraggableItemTypes.FavoriteNode:
                {
                    const draggedFavorite = dragData as FavoriteNodeDragData;
                    const dropTargetId = props.favoriteId;
                    const dragTargetId = draggedFavorite.favoriteId;
                    const updateFavoritePosition = await lazyUpdateFavoritePosition.import();
                    updateFavoritePosition(
                        dragTargetId /* idToUpdate */,
                        dropTargetId /* desitnationFolderId */,
                        draggedFavorite.favoriteType
                    );
                }
                break;
        }
    };
    const onDragOver = (dragData: DragData) => {
        isDragOver.current = true;
    };
    const onDragLeave = () => {
        isDragOver.current = false;
    };
    const getDragData = () => {
        const displayName = getEffectiveFolderDisplayName(getFolder());
        const folderNodeDragData: FavoriteNodeDragData = {
            itemType: DraggableItemTypes.FavoriteNode,
            favoriteId: props.favoriteId,
            favoriteType: props.isPublicFolder
                ? FolderForestNodeType.PublicFolder
                : FolderForestNodeType.Folder,
            displayName: displayName,
        };
        return folderNodeDragData;
    };
    const folder = getFolder();
    const folderViewState = getFolderViewStateFromId(props.favoriteId);
    const itemType = folderViewState.drop.draggableItemType;
    return (
        <DragAndDroppable
            dragViewState={folderViewState.drag}
            getDragData={getDragData}
            getDragPreview={getDragPreview}
            xOffset={DRAG_X_OFFSET}
            yOffset={DRAG_Y_OFFSET}
            dropViewState={folderViewState.drop}
            onDrop={onDrop}
            canDrop={canDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}>
            <FolderNode
                customIcon={getCustomIcon(props.folderId, true)}
                displayName={getEffectiveFolderDisplayName(folder)}
                folderId={props.folderId}
                isDroppedOver={folderViewState.drop.isDragOver && isDragOver.current}
                isBeingDragged={folderViewState.drag.isBeingDragged}
                key={props.folderId}
                onContextMenu={onContextMenu}
                showHoverStateOnDroppedOver={
                    itemType == DraggableItemTypes.MailListRow ||
                    itemType == DraggableItemTypes.MultiMailListConversationRows ||
                    itemType == DraggableItemTypes.MultiMailListMessageRows ||
                    itemType == DraggableItemTypes.MailListItemPart
                }
                treeType={'favorites'}
                isPublicFolder={props.isPublicFolder}
                unreadCount={folder.UnreadCount}
                totalCount={folder.TotalCount}
                distinguishedFolderId={folder.DistinguishedFolderId}
            />
        </DragAndDroppable>
    );
});

function canDrop(dragData: DragData): boolean {
    const itemType = dragData.itemType;
    switch (itemType) {
        case DraggableItemTypes.MailListItemPart:
        case DraggableItemTypes.MailListRow:
        case DraggableItemTypes.MultiMailListConversationRows:
        case DraggableItemTypes.MultiMailListMessageRows:
        case DraggableItemTypes.FavoriteNode:
        case DraggableItemTypes.MailFolderNode:
            return true;
        default:
            return false;
    }
}

function getDragPreview(folderNodeDragData: FavoriteNodeDragData) {
    const elem = document.createElement('div');
    elem.className = styles.dragPreview;
    elem.innerText = folderNodeDragData.displayName;
    return elem;
}
