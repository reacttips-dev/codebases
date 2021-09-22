import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
/* tslint:disable:jsx-no-lambda WI:47714 */
import type { FavoriteNodeCommonProps } from './FavoriteNode';
import { logUsage } from 'owa-analytics';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import folderStore from 'owa-folders';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from 'owa-mail-folder-view';
import { ControlIcons } from 'owa-control-icons';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { lazyUpdateFavoritePosition, isOutlookFavoritingInProgress } from 'owa-favorites';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import { lazySelectPrivateDistributionList } from 'owa-mail-folder-forest-actions';
import { showFavoritesContextMenu } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import { getAnchorForContextMenu } from 'owa-positioning';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import { removeFavoritePDL } from '../util/removeFavorite';

export interface FavoritePrivateDistributionListNodeProps extends FavoriteNodeCommonProps {
    displayName: string;
    searchFolderId: string;
    isSearchFolderPopulated: boolean;
    favoriteId: string;
    dropViewState: DropViewState;
}

import styles from './FavoriteNode.scss';

export default observer(function FavoritePrivateDistributionListNode(
    props: FavoritePrivateDistributionListNodeProps
) {
    const isSelected = useComputed((): boolean => {
        return props.favoriteId === getSelectedNode().id;
    });
    const getUnreadCount = (): number => {
        if (props.isSearchFolderPopulated && folderStore.folderTable.has(props.searchFolderId)) {
            const folder = folderStore.folderTable.get(props.searchFolderId);
            return folder.UnreadCount;
        }
        return 0;
    };
    const renderUnreadCount = (): JSX.Element => {
        const folderUnreadCount = getUnreadCount();
        return <UnreadReadCountBadge count={folderUnreadCount} isSelected={isSelected.get()} />;
    };
    const onContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        if (!isOutlookFavoritingInProgress('FavoritePdl')) {
            showFavoritesContextMenu(
                props.favoriteId,
                FolderForestNodeType.PrivateDistributionList,
                getAnchorForContextMenu(evt),
                props.searchFolderId
            );
        }
    };
    const onNodeSelected = (evt: React.MouseEvent<unknown>, personaId: string) => {
        evt.stopPropagation();
        logUsage('PrivateDistributionListClicked', [props.favoriteId, getUnreadCount()]);
        lazySelectPrivateDistributionList.importAndExecute(props.favoriteId);
    };
    // VSO 23480 - [FavoritesDND]Refactor the common DND code into a base component
    const canDrop = (dragData: DragData): boolean => {
        if (!props.searchFolderId) {
            return false;
        }
        return dragData.itemType === DraggableItemTypes.FavoriteNode;
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
    const getDragData = () => {
        const folderNodeDragData: FavoriteNodeDragData = {
            itemType: DraggableItemTypes.FavoriteNode,
            favoriteId: props.favoriteId,
            favoriteType: FolderForestNodeType.PrivateDistributionList,
            displayName: props.displayName,
        };
        return folderNodeDragData;
    };
    const toggleFavorite = () => {
        removeFavoritePDL(props.favoriteId);
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
            <div>
                <TreeNode
                    customIcon={ControlIcons.ContactList}
                    displayName={props.displayName}
                    key={props.favoriteId}
                    isDroppedOver={props.dropViewState.isDragOver}
                    isRootNode={false}
                    isSelected={isSelected.get()}
                    onClick={(evt: React.MouseEvent<unknown>) =>
                        onNodeSelected(evt, props.favoriteId)
                    }
                    onContextMenu={onContextMenu}
                    renderRightCharm={renderUnreadCount}
                    renderRightCharmHover={renderUnreadCount}
                    showAsHoverOnDroppedOver={false}
                    isFavorited={true}
                    toggleFavorite={toggleFavorite}
                />
            </div>
        </DragAndDroppable>
    );
});

function getDragPreview(folderNodeDragData: FavoriteNodeDragData) {
    const elem = document.createElement('div');
    elem.className = styles.dragPreview;
    elem.innerText = folderNodeDragData.displayName;
    return elem;
}
