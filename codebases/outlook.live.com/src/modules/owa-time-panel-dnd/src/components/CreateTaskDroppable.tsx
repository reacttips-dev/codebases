import { createTaskFromMailItemDrop } from '../actions/dropActions';
import type { DropTarget } from '../datapoints';
import { observer } from 'mobx-react-lite';
import { DropViewState, DragData, DraggableItemTypes, Droppable } from 'owa-dnd';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import * as React from 'react';

export interface CreateTaskDroppableProps {
    dropViewState: DropViewState;
    dropTarget: DropTarget;
    classNames?: string;
    children?: React.ReactNode;
    canCreateTaskInFolder?: (folderId?: string) => boolean;
    folderId?: string;
}

/**
 * This component handles creating a task from items dropped on it.
 * For now, that's creating a task from email messages.
 */
export default observer(function CreateTaskDroppable(props: CreateTaskDroppableProps) {
    const {
        dropViewState,
        dropTarget,
        classNames,
        children,
        canCreateTaskInFolder,
        folderId,
    } = props;

    const canDropCallback = React.useCallback(
        (dragInfo: DragData) => {
            return canDrop(dragInfo, canCreateTaskInFolder, folderId);
        },
        [canCreateTaskInFolder, folderId]
    );

    const onDropCallback = React.useCallback(
        (dragData: DragData, pageX: number, pageY: number, target?: HTMLElement) => {
            onDrop(dragData, dropTarget, folderId);
        },
        [folderId]
    );

    return (
        <Droppable
            dropViewState={dropViewState}
            canDrop={canDropCallback}
            onDrop={onDropCallback}
            classNames={classNames}
            greedy={true}>
            {children}
        </Droppable>
    );
});

function onDrop(dragData: DragData, dropTarget: DropTarget, folderId?: string): void {
    switch (dragData.itemType) {
        case DraggableItemTypes.MailListRow:
            const mailListDragData = dragData as MailListRowDragData;
            createTaskFromMailItemDrop(mailListDragData, dropTarget, folderId);
            break;
    }
}

function canDrop(
    dragInfo: DragData,
    canCreateTaskInFolder?: (folderId?: string) => boolean,
    folderId?: string
): boolean {
    // Users can always add in the default folder
    const canAddTasks = folderId ? canCreateTaskInFolder?.(folderId) : true;

    /**
     * We need to add Todo to the types allowed to drop, otherwise we get the
     * no-drop-allowed effect when reordering tasks.
     */
    return (
        // If we are dragging an email item, then check whether we can actually create tasks in this folder.
        // If we are dragging a task item, allow reordering because that's the only view we support right now.
        // TODO VSO 66844: Remove owa-time-panel-dnd dependency on Todo panel specific information
        (dragInfo.itemType === DraggableItemTypes.MailListRow && canAddTasks) ||
        dragInfo.itemType === DraggableItemTypes.Todo
    );
}
