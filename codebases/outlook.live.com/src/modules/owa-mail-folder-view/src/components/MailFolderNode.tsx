import { default as FolderNode } from './FolderNode';
import { DRAG_X_OFFSET, DRAG_Y_OFFSET } from '../helpers/folderNodeDragConstants';
import { observer } from 'mobx-react-lite';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import type { FolderForestTreeType } from 'owa-graph-schema';
import { getCustomIcon } from 'owa-folders-common';
import toggleFolderNodeExpansion from 'owa-mail-folder-store/lib/actions/toggleFolderNodeExpansion';
import getFolderViewStateFromId from 'owa-mail-folder-store/lib/selectors/getFolderViewStateFromId';
import type MailFolderDragData from 'owa-mail-folder-store/lib/store/schema/MailFolderDragData';
import { listViewStore } from 'owa-mail-list-store';
import * as lazyTriageActions from 'owa-mail-triage-action';
import type { MailListItemPartDragData } from 'owa-mail-types/lib/types/MailListItemPartDragData';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import type { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import { FolderOperationNode } from '../index';
import { shouldRenderNodeInEditMode } from './utils/shouldRenderNodeInEditMode';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import type { MailboxInfo } from 'owa-client-ids';
import type { MailFolderNodeFragment } from './__generated__/MailFolderNode.interface';

import mailFolderNodeStyles from './MailFolderNode.scss';

export interface MailFolderNodeProps {
    depth: number; // root is 0, every sub node increase this number by 1.
    folderId: string;
    folder: MailFolderNodeFragment;
    treeType: FolderForestTreeType; // Type of folder tree
    isFolderExpandable: boolean;
    effectiveFolderDisplayName: string;
    distinguishedFolderParentIds?: string[];
    onContextMenu?: (
        evt: React.MouseEvent<unknown>,
        folderId: string,
        distinguishedFolderParentIds: string[]
    ) => void;
    mailboxInfo: MailboxInfo;
    moveFolder: (
        destinationFolderId: string,
        destinationFolderMailboxInfo: MailboxInfo,
        sourceFolderId: string,
        sourceFolderMailboxInfo: MailboxInfo,
        sourceFolderParentFolderId: string,
        sourceFolderDisplayName: string
    ) => void;
    isBeingDragged?: boolean;
    shouldHideToggleFavorite?: boolean; // flag indicating whether to show toggle favorite option
}

export default observer(function MailFolderNode(props: MailFolderNodeProps) {
    // Besides the isDragOver property in store, we also add this property here to distinguish from the dropping on FavoriteFolderNode
    const [isDragOver, setIsDragOver] = React.useState(false);
    const {
        folderId,
        treeType,
        depth,
        folder,
        isBeingDragged,
        mailboxInfo,
        effectiveFolderDisplayName,
        shouldHideToggleFavorite,
        isFolderExpandable,
        onContextMenu,
        distinguishedFolderParentIds,
        moveFolder,
    } = props;

    const folderViewState = getFolderViewStateFromId(folderId);

    const renderInEditMode = useComputedValue((): boolean => {
        return shouldRenderNodeInEditMode(folderId, 'rename', mailboxInfo.mailboxSmtpAddress);
    }, [folderId, mailboxInfo.mailboxSmtpAddress]);

    const renderAddNewNode = useComputedValue((): boolean => {
        return shouldRenderNodeInEditMode(folderId, 'new', mailboxInfo.mailboxSmtpAddress);
    }, [folderId, mailboxInfo.mailboxSmtpAddress]);

    const renderAddNewOrEditNode = (
        folderId: string,
        treeType: FolderForestTreeType,
        nestDepth: number,
        operationType: string,
        originalValue?: string
    ): JSX.Element => {
        return (
            <FolderOperationNode
                folderId={folderId}
                treeType={treeType}
                nestDepth={nestDepth}
                operationType={operationType}
                originalValue={originalValue}
                mailboxInfo={mailboxInfo}
            />
        );
    };

    const getChevronProps = (): ChevronProps => {
        // Check if the node is expandable / should have chevrons
        if (isFolderExpandable) {
            return { isExpanded: folderViewState.isExpanded, onClick: onChevronClicked };
        } else {
            return null;
        }
    };

    const onChevronClicked = (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
        evt.stopPropagation();
        toggleFolderNodeExpansion(folderId);
    };

    const onContextMenu_0 = (evt: React.MouseEvent<unknown>) => {
        if (onContextMenu) {
            evt.stopPropagation();
            evt.preventDefault();

            onContextMenu(evt, folderId, distinguishedFolderParentIds);
        }
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
                        folderId,
                        tableView.id,
                        'Drag'
                    );
                }
                break;
            case DraggableItemTypes.MailListRow:
            case DraggableItemTypes.MultiMailListMessageRows:
            case DraggableItemTypes.MultiMailListConversationRows:
                {
                    const mailListRowDragData = dragData as MailListRowDragData;
                    const tableViewId = mailListRowDragData.tableViewId;
                    const rowKeys = mailListRowDragData.rowKeys;
                    lazyTriageActions.lazyMoveMailListRows.importAndExecute(
                        rowKeys,
                        folderId,
                        tableViewId,
                        'Drag'
                    );
                }
                break;

            case DraggableItemTypes.MailFolderNode:
                {
                    const mailFolderItemBeingDragged = dragData as MailFolderDragData;
                    const draggedFolderId = mailFolderItemBeingDragged.folderId;
                    const draggedFolderMailboxInfo = mailFolderItemBeingDragged.mailboxInfo;
                    const draggedFolderParentFolderId = mailFolderItemBeingDragged.parentFolderId;

                    moveFolder(
                        folderId /*destinationFolderId */,
                        mailboxInfo /* destinationFolderMailboxInfo */,
                        draggedFolderId /* sourceFolderId */,
                        draggedFolderMailboxInfo /* sourceFolderMailboxInfo */,
                        draggedFolderParentFolderId /* parentFolderId */,
                        mailFolderItemBeingDragged.displayName
                    );
                }
                break;
        }
    };

    const canDrop = (dragData: DragData) => {
        if (folder.DistinguishedFolderId === 'notes') {
            return false;
        }
        const itemType = dragData.itemType;

        switch (itemType) {
            case DraggableItemTypes.MailFolderNode:
            case DraggableItemTypes.MailListItemPart:
            case DraggableItemTypes.MailListRow:
            case DraggableItemTypes.MultiMailListMessageRows:
            case DraggableItemTypes.MultiMailListConversationRows:
                return true;

            case DraggableItemTypes.FavoriteNode:
            default:
                return false;
        }
    };

    const onDragOver = (dragData: DragData) => {
        setIsDragOver(true);
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (isDragOver) {
                if (isFolderExpandable && !folderViewState.isExpanded) {
                    toggleFolderNodeExpansion(folderId);
                }
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isDragOver]);

    const onDragLeave = () => {
        setIsDragOver(false);
    };

    const getDragData = () => {
        const folderNodeDragData: MailFolderDragData = {
            itemType: DraggableItemTypes.MailFolderNode,
            folderId: folderId,
            displayName: effectiveFolderDisplayName,
            treeType: treeType,
            mailboxInfo: mailboxInfo,
            parentFolderId: folder.ParentFolderId.Id,
        };

        return folderNodeDragData;
    };

    return (
        <>
            {
                /**
                 * Render edit node if renaming
                 */
                renderInEditMode &&
                    renderAddNewOrEditNode(
                        folderId,
                        treeType,
                        depth,
                        'rename',
                        effectiveFolderDisplayName
                    )
            }
            {
                /**
                 * Render node if not editing
                 */
                !renderInEditMode && (
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
                            chevronProps={getChevronProps()}
                            customIcon={getCustomIcon(folderId, false)}
                            depth={depth}
                            displayName={effectiveFolderDisplayName}
                            folderId={folderId}
                            isDroppedOver={folderViewState.drop?.isDragOver && isDragOver}
                            isBeingDragged={isBeingDragged}
                            onContextMenu={onContextMenu_0}
                            treeType={treeType}
                            shouldHideToggleFavorite={shouldHideToggleFavorite}
                            showHoverStateOnDroppedOver={true}
                            totalCount={folder.TotalCount}
                            unreadCount={folder.UnreadCount}
                            distinguishedFolderId={folder.DistinguishedFolderId}
                        />
                    </DragAndDroppable>
                )
            }
            {
                /**
                 * Render add new sub node
                 */
                renderAddNewNode && renderAddNewOrEditNode(folderId, treeType, depth, 'new')
            }
        </>
    );
});

function getDragPreview(folderNodeDragData: MailFolderDragData) {
    const elem = document.createElement('div');
    elem.className = mailFolderNodeStyles.dragHelperStyle;
    elem.innerText = folderNodeDragData.displayName;
    return elem;
}
