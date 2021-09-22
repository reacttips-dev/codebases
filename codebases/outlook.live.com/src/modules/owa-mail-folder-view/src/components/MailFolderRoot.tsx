import Droppable from 'owa-dnd/lib/components/Droppable';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import { FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType } from 'owa-graph-schema';
import { showFolderTreeContextMenu } from 'owa-mail-folder-store/lib/actions/folderTreeContextMenu';
import type MailFolderDragData from 'owa-mail-folder-store/lib/store/schema/MailFolderDragData';
import { getAnchorForContextMenu } from 'owa-positioning';
import TreeNode, { ChevronProps } from 'owa-tree-node/lib/components/TreeNode';
import * as React from 'react';
import type { MailboxInfo } from 'owa-client-ids';
import type { MailFolderRootFragment } from './__generated__/MailFolderRoot.interface';

interface MailFolderRootProps {
    rootFolder: MailFolderRootFragment; // Root folder details
    shouldBeDroppable: boolean;
    displayName: string;
    rootNodeId: string;
    treeType: FolderForestTreeType; // Type of folder tree
    mailboxInfo: MailboxInfo;
    moveFolder: (
        destinationFolderId: string,
        destinationFolderMailboxInfo: MailboxInfo,
        sourceFolderId: string,
        sourceFolderMailboxInfo: MailboxInfo,
        sourceFolderParentFolderId: string,
        sourceFolderDisplayName: string
    ) => void;
    setSize?: number;
    positionInSet?: number;

    shouldShowRootNodeContextMenu: boolean;
    isRootExpanded: boolean;
    onRootNodeChevronClickedCallback: () => void; // Callback on click of root folder
}

export default function MailFolderRoot(props: MailFolderRootProps) {
    const onRootNodeChevronClicked = React.useCallback(
        (evt: React.MouseEvent<unknown> | KeyboardEvent) => {
            evt.stopPropagation();
            props.onRootNodeChevronClickedCallback();
        },
        [props.onRootNodeChevronClickedCallback]
    );

    const chevronProps: ChevronProps = {
        isExpanded: props.isRootExpanded,
        onClick: onRootNodeChevronClicked,
    };

    const emptyDropViewState = createDropViewState();
    const onDrop = React.useCallback(
        (dragData: DragData) => {
            const mailFolderItemBeingDragged = dragData as MailFolderDragData;
            const draggedFolderId = mailFolderItemBeingDragged.folderId;
            const draggedFolderMailboxInfo = mailFolderItemBeingDragged.mailboxInfo;
            const draggedFolderParentFolderId = mailFolderItemBeingDragged.parentFolderId;
            props.moveFolder(
                props.rootFolder.FolderId.Id /*destinationFolderId */,
                props.mailboxInfo /* destinationFolderMailboxInfo */,
                draggedFolderId /* sourceFolderId */,
                draggedFolderMailboxInfo /* sourceFolderMailboxInfo */,
                draggedFolderParentFolderId /* parentFolderId */,
                mailFolderItemBeingDragged.displayName
            );
        },
        [props.rootFolder?.FolderId?.Id, props.mailboxInfo.type]
    );

    const canDrop = React.useCallback(
        (dragData: DragData) => {
            const itemType = dragData.itemType;
            return (
                itemType === DraggableItemTypes.MailFolderNode &&
                props.shouldBeDroppable &&
                !!props.rootFolder
            );
        },
        [props.shouldBeDroppable, !!props.rootFolder]
    );

    const onRootNodeContextMenu = React.useCallback(
        (evt: React.MouseEvent<HTMLElement>) => {
            evt.preventDefault();
            if (props.shouldShowRootNodeContextMenu) {
                showFolderTreeContextMenu(
                    props.rootFolder.FolderId.Id,
                    FolderForestNodeType.Folder,
                    props.rootFolder.FolderId.Id,
                    getAnchorForContextMenu(evt),
                    props.treeType,
                    props.rootNodeId,
                    true /* showRootNodeMenu */
                );
            }
        },
        [
            props.shouldShowRootNodeContextMenu,
            props.rootFolder?.FolderId?.Id,
            props.rootFolder,
            props.treeType,
            props.rootNodeId,
        ]
    );

    return (
        /* Render root node */
        <Droppable dropViewState={emptyDropViewState} onDrop={onDrop} canDrop={canDrop}>
            <TreeNode
                chevronProps={chevronProps}
                depth={0} // Started at 0 depth
                displayName={props.displayName}
                isRootNode={true}
                onClick={chevronProps.onClick}
                onContextMenu={onRootNodeContextMenu}
                setSize={props.setSize}
                positionInSet={props.positionInSet}
            />
        </Droppable>
    );
}
