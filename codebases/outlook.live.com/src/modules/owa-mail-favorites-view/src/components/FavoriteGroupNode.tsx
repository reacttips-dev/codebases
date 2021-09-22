import { observer } from 'mobx-react-lite';
import type { FavoriteNodeCommonProps } from './FavoriteNode';
import { ControlIcons } from 'owa-control-icons';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import {
    GroupRightCharm,
    GroupRightCharmHover,
    lazyDropMailListRowsOnGroup,
} from 'owa-group-left-nav-mail';
import GroupNode from 'owa-group-left-nav/lib/components/GroupNode';
import { getFavoriteNodeViewStateFromId } from 'owa-mail-favorites-store';
import { showFavoritesContextMenu } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import { isGroupNodeSelected, lazySelectGroup } from 'owa-mail-folder-forest-actions';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from 'owa-mail-folder-view';
import { getAnchorForContextMenu } from 'owa-positioning';
import * as React from 'react';
import { getFavoriteIdFromGroupId, lazyUpdateFavoritePosition } from 'owa-favorites';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import PeopleRegular from 'owa-fluent-icons-svg/lib/icons/PeopleRegular';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './FavoriteNode.scss';

export interface FavoriteGroupNodeProps extends FavoriteNodeCommonProps {
    displayName: string;
    groupId: string;
}

export default observer(function FavoriteGroupNode(props: FavoriteGroupNodeProps) {
    // Besides the isDragOver property in store, we also add this property here to distingush from the dropping on MailFolderNode
    const isDragOver = React.useRef<boolean>();
    const onContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        showFavoritesContextMenu(
            props.favoriteId,
            FolderForestNodeType.Group,
            getAnchorForContextMenu(evt)
        );
    };
    const onDrop = async (dragData: DragData) => {
        const itemType = dragData.itemType;
        switch (itemType) {
            case DraggableItemTypes.FavoriteNode:
                {
                    const draggedFavorite = dragData as FavoriteNodeDragData;
                    const dropTargetId = props.favoriteId;
                    const dragTargetId = draggedFavorite.favoriteId;
                    const updateFavoritePosition = await lazyUpdateFavoritePosition.import();
                    updateFavoritePosition(
                        dragTargetId, // idToUpdate
                        dropTargetId, // destinationFolderId
                        draggedFavorite.favoriteType
                    );
                }
                break;
            case DraggableItemTypes.MultiMailListMessageRows:
            case DraggableItemTypes.MailListRow:
                lazyDropMailListRowsOnGroup.importAndExecute(
                    dragData as MailListRowDragData,
                    props.groupId
                );
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
        const displayName = props.displayName;
        const groupNodeDragData: FavoriteNodeDragData = {
            itemType: DraggableItemTypes.FavoriteNode,
            favoriteId: props.favoriteId,
            favoriteType: FolderForestNodeType.Group,
            displayName: displayName,
        };
        return groupNodeDragData;
    };
    const favoriteId = getFavoriteIdFromGroupId(props.groupId);
    const viewState = getFavoriteNodeViewStateFromId(favoriteId);
    return (
        <DragAndDroppable
            dragViewState={viewState.drag}
            getDragData={getDragData}
            getDragPreview={getDragPreview}
            xOffset={DRAG_X_OFFSET}
            yOffset={DRAG_Y_OFFSET}
            dropViewState={viewState.drop}
            onDrop={onDrop}
            canDrop={canDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}>
            <GroupNode
                selectGroup={selectGroupInternal}
                isSelected={isGroupNodeSelectedInternal}
                renderRightCharm={renderRightCharm}
                renderRightCharmHover={renderRightCharmHover}
                displayName={props.displayName}
                groupId={props.groupId}
                customIcon={isFeatureEnabled('mon-densities') ? PeopleRegular : ControlIcons.Group}
                isDroppedOver={viewState.drop.isDragOver && isDragOver.current}
                isBeingDragged={viewState.drag.isBeingDragged}
                key={props.groupId}
                onContextMenu={onContextMenu}
                showHoverStateOnDroppedOver={
                    viewState.drop.draggableItemType == DraggableItemTypes.MailListRow ||
                    viewState.drop.draggableItemType == DraggableItemTypes.MultiMailListMessageRows
                }
                isFavorited={true}
            />
        </DragAndDroppable>
    );
});

function renderRightCharm(groupId: string, customData: any): JSX.Element {
    return <GroupRightCharm groupId={groupId} />;
}

function renderRightCharmHover(groupId: string, customData: any): JSX.Element {
    return <GroupRightCharmHover groupId={groupId} />;
}

function selectGroupInternal(groupId: string, customData: any) {
    lazySelectGroup.importAndExecute(groupId, 'favorites');
}

function isGroupNodeSelectedInternal(groupId: string, customData: any): boolean {
    return isGroupNodeSelected(groupId, 'favorites');
}

function canDrop(dragData: DragData): boolean {
    const itemType = dragData.itemType;
    switch (itemType) {
        case DraggableItemTypes.FavoriteNode:
        case DraggableItemTypes.MailListRow:
        case DraggableItemTypes.MultiMailListMessageRows:
            return true;
        default:
            return false;
    }
}

function getDragPreview(groupNodeDragData: FavoriteNodeDragData) {
    const elem = document.createElement('div');
    elem.className = styles.dragPreview;
    elem.innerText = groupNodeDragData.displayName;
    return elem;
}
