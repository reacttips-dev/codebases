import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { CategoryIcon, getMasterCategoryList, getCategoryUnreadCount } from 'owa-categories';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { lazyUpdateFavoritePosition } from 'owa-favorites';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import { showFavoritesContextMenu } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import { lazySelectFavoriteCategory } from 'owa-mail-folder-forest-actions';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from 'owa-mail-folder-view';
import { getAnchorForContextMenu } from 'owa-positioning';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import { removeFavoriteCategory } from '../util/removeFavorite';

import styles from './FavoriteNode.scss';

export interface FavoriteCategoryNodeProps {
    categoryId: string;
    favoriteId: string;
    dropViewState: DropViewState;
}

export default observer(function FavoriteCategoryNode(props: FavoriteCategoryNodeProps) {
    const category = useComputed(
        (): CategoryType => {
            return getMasterCategoryList().filter(
                categoryType => categoryType.Id === props.categoryId
            )[0];
        }
    );
    const isSelected = useComputed((): boolean => {
        return props.categoryId == getSelectedNode().id;
    });
    const unreadCount = useComputed((): number => {
        return getCategoryUnreadCount(category.get().Name);
    });
    const renderUnreadCount = (): JSX.Element => {
        return <UnreadReadCountBadge count={unreadCount.get()} isSelected={isSelected.get()} />;
    };
    const renderCustomIcon = (customIconClassNames: string): JSX.Element => {
        return (
            <CategoryIcon categoryName={category.get().Name} iconClassName={customIconClassNames} />
        );
    };
    const onClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        lazySelectFavoriteCategory.importAndExecute(props.categoryId);
    };
    const onContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        showFavoritesContextMenu(
            props.favoriteId,
            FolderForestNodeType.Category,
            getAnchorForContextMenu(evt)
        );
    };
    // VSO 23480 - [FavoritesDND]Refactor the common DND code into a base component
    const getDragData = () => {
        const folderNodeDragData: FavoriteNodeDragData = {
            itemType: DraggableItemTypes.FavoriteNode,
            favoriteId: props.favoriteId,
            favoriteType: FolderForestNodeType.Category,
            displayName: category.get().Name,
        };
        return folderNodeDragData;
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
    // If the categoryId does not exist within the MCL early return
    // This can happen in edge cases such as when a category is favorited and then immediately deleted from the MCL
    if (category.get() === undefined) {
        return null;
    }
    const toggleFavorite = () => {
        removeFavoriteCategory(props.categoryId);
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
                onRenderCustomIcon={renderCustomIcon}
                displayName={category.get().Name}
                isRootNode={false}
                key={props.categoryId}
                isDroppedOver={props.dropViewState.isDragOver}
                onClick={onClick}
                isSelected={isSelected.get()}
                onContextMenu={onContextMenu}
                renderRightCharm={renderUnreadCount}
                isFavorited={true}
                toggleFavorite={toggleFavorite}
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
