import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { unreadCountScreenReaderOnlyText } from 'owa-locstrings/lib/strings/unreadcountscreenreaderonlytext.locstring.json';
import { numNew } from './FavoritePersonaNode.locstring.json';
import loc, { format } from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47714 */
import type { FavoriteNodeCommonProps } from './FavoriteNode';
import { AnimationClassNames } from '@fluentui/style-utilities/lib/index';
import { logUsage } from 'owa-analytics';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import folderStore from 'owa-folders';
import { showFavoritesContextMenu } from 'owa-mail-favorites-store/lib/actions/favoritesContextMenu';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from 'owa-mail-folder-view';
import { ControlIcons } from 'owa-control-icons';
import { getAnchorForContextMenu } from 'owa-positioning';
import TreeNode from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { lazyUpdateFavoritePosition } from 'owa-favorites';
import { isGuid } from 'owa-guid';
import { FolderForestNodeType, FavoriteNodeDragData } from 'owa-favorites-types';
import {
    lazyMarkFavoritePersonaNodeAsAdded,
    isFavoritingInProgress,
} from 'owa-mail-favorites-store';
import { lazySelectPersona } from 'owa-mail-folder-forest-actions';
import { isFolderPaused } from 'owa-mail-list-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import { removeFavoritePersona } from '../util/removeFavorite';
import PersonRegular from 'owa-fluent-icons-svg/lib/icons/PersonRegular';
import { isFeatureEnabled } from 'owa-feature-flags';

import classnames from 'classnames';

export interface FavoritePersonaNodeProps extends FavoriteNodeCommonProps {
    displayName: string;
    emailAddress: string;
    personaId: string;
    searchFolderId: string;
    dropViewState: DropViewState;
    isJustAdded: boolean;
    isSearchFolderPopulated: boolean;
}

import styles from './FavoriteNode.scss';

export default observer(function FavoritePersonaNode(props: FavoritePersonaNodeProps) {
    React.useEffect(() => {
        markNodeAsAdded();
    }, []);
    const isSelected = useComputed((): boolean => {
        return props.favoriteId === getSelectedNode().id;
    });
    const isSearchFolderReady = (): boolean => {
        return props.isSearchFolderPopulated && folderStore.folderTable.has(props.searchFolderId);
    };
    const unreadCount = (): number => {
        if (isSearchFolderReady()) {
            const folder = folderStore.folderTable.get(props.searchFolderId);
            return folder.UnreadCount;
        }
        return 0;
    };
    const markNodeAsAdded = (): void => {
        if (props.isJustAdded) {
            setTimeout(() => {
                lazyMarkFavoritePersonaNodeAsAdded.importAndExecute(props.favoriteId);
            }, 666 /* animation duration */);
        }
    };
    const renderUnreadOrNewCount = (): JSX.Element => {
        let newCount;
        let folderUnreadCount = 0;
        if (isSearchFolderReady()) {
            const folder = folderStore.folderTable.get(props.searchFolderId);
            // Show new count if inbox is paused and there have been new emails in the
            // persona favorite folder since user paused. Do not show if currently have the node selected.
            if (
                !isSelected.get() &&
                folder.pausedTotalCount &&
                isFolderPaused(folderNameToId('inbox'))
            ) {
                const deltaTotalCount = folder.TotalCount - folder.pausedTotalCount;
                if (deltaTotalCount > 0) {
                    newCount = format(loc(numNew), deltaTotalCount);
                }
            }
            folderUnreadCount = folder.UnreadCount;
        }
        if (folderUnreadCount === 0 && !newCount) {
            return null;
        }
        return (
            <UnreadReadCountBadge
                count={newCount || folderUnreadCount}
                screenReaderText={loc(unreadCountScreenReaderOnlyText)}
                customStyle={newCount ? styles.newCount : styles.unreadCount}
                isSelected={isSelected.get()}
            />
        );
    };
    const onPersonaSelected = (evt: React.MouseEvent<EventTarget>) => {
        evt.stopPropagation();
        const idToLog = isGuid(props.favoriteId) ? props.favoriteId : '';
        logUsage('PersonaClicked', [idToLog, unreadCount()]);
        lazySelectPersona.importAndExecute(props.favoriteId);
    };
    const onContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        const isInProgress =
            isFavoritingInProgress(props.personaId) || isFavoritingInProgress(props.emailAddress);
        if (!isInProgress) {
            showFavoritesContextMenu(
                props.favoriteId,
                FolderForestNodeType.Persona,
                getAnchorForContextMenu(evt),
                props.searchFolderId
            );
        }
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
            favoriteType: FolderForestNodeType.Persona,
            displayName: props.displayName,
        };
        return folderNodeDragData;
    };

    const toggleFavorite = () => {
        removeFavoritePersona(props.favoriteId);
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
            <div
                className={
                    props.isJustAdded
                        ? classnames(AnimationClassNames.slideDownIn20, styles.addedNode)
                        : ''
                }>
                <TreeNode
                    customIcon={
                        isFeatureEnabled('mon-densities') ? PersonRegular : ControlIcons.Contact
                    }
                    displayName={props.displayName}
                    key={props.favoriteId}
                    isDroppedOver={props.dropViewState.isDragOver}
                    isRootNode={false}
                    isSelected={isSelected.get()}
                    onClick={onPersonaSelected}
                    onContextMenu={onContextMenu}
                    renderRightCharm={renderUnreadOrNewCount}
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
