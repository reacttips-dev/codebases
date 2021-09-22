import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { ControlIcons } from 'owa-control-icons';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { lazySelectFavoriteSearch } from 'owa-mail-folder-forest-actions';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { lazyUpdateFavoritePosition } from 'owa-favorites';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from 'owa-mail-folder-view';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';

import styles from './FavoriteNode.scss';

export interface FavoriteSearchNodeProps {
    searchQuery: string;
    favoriteId: string;
    dropViewState: DropViewState;
}

export default observer(function FavoriteSearchNode(props: FavoriteSearchNodeProps) {
    const isSelected = useComputed((): boolean => {
        return props.searchQuery == getSelectedNode().id;
    });
    const onClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        lazySelectFavoriteSearch.importAndExecute(props.searchQuery);
    };
    // VSO 23480 - [FavoritesDND]Refactor the common DND code into a base component
    const getDragData = () => {
        const favoriteNodeDragData: FavoriteNodeDragData = {
            itemType: DraggableItemTypes.FavoriteNode,
            favoriteId: props.favoriteId,
            favoriteType: FolderForestNodeType.Search,
            displayName: props.searchQuery,
        };
        return favoriteNodeDragData;
    };
    const onDrop = async (dragData: DragData) => {
        if (!canDrop(dragData)) {
            return;
        }
        const draggedFavorite = dragData as FavoriteNodeDragData;
        const dropTargetId = props.favoriteId;
        const dragTargetId = draggedFavorite.favoriteId;
        // Updates user configuration
        const updateFavoritePosition = await lazyUpdateFavoritePosition.import();
        updateFavoritePosition(
            dragTargetId /* idToUpdate */,
            dropTargetId /* destinationFolderId */,
            draggedFavorite.favoriteType
        );
    };
    return (
        <DragAndDroppable
            getDragData={getDragData}
            getDragPreview={getDragPreview}
            xOffset={DRAG_X_OFFSET}
            yOffset={DRAG_Y_OFFSET}
            dropViewState={props.dropViewState}
            onDrop={onDrop}
            canDrop={canDrop}>
            <TreeNode
                customIcon={ControlIcons.Search}
                displayName={props.searchQuery}
                isRootNode={false}
                key={props.searchQuery}
                isDroppedOver={props.dropViewState.isDragOver}
                onClick={onClick}
                isSelected={isSelected.get()}
            />
        </DragAndDroppable>
    );
});

function getDragPreview(favoriteNodeDragData: FavoriteNodeDragData) {
    const elem = document.createElement('div');
    elem.className = styles.dragPreview;
    elem.innerText = favoriteNodeDragData.displayName;
    return elem;
}

function canDrop(dragData: DragData): boolean {
    return dragData.itemType === DraggableItemTypes.FavoriteNode;
}
