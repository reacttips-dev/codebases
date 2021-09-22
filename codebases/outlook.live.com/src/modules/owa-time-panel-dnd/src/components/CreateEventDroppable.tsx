import { createEventFromMailItemDrop } from '../actions/dropActions';
import type { DropTarget } from '../datapoints';
import { observer } from 'mobx-react-lite';
import getDefaultStart from 'owa-calendar-forms-common/lib/utils/getDefaultStart';
import type { OwaDate } from 'owa-datetime';
import { DragData, DraggableItemTypes, Droppable, DropViewState } from 'owa-dnd';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import * as React from 'react';

export interface CreateEventDroppableProps {
    dropViewState: DropViewState;
    dropTarget: DropTarget;
    classNames?: string;
    selectedDate?: OwaDate;
    generateStartTime?: (selectedDate?: OwaDate) => OwaDate;
    handleDrop?: () => void;
    handleDragEnter?: () => void;
    handleDragOver?: () => void;
    handleDragLeave?: () => void;
    children?: React.ReactNode;
}

/**
 * This component handles creating a meeting from items dropped on it.
 * For now, that's creating a meeting from email messages.
 */
export default observer(function CreateEventDroppable(props: CreateEventDroppableProps) {
    const {
        dropViewState,
        dropTarget,
        classNames,
        selectedDate,
        generateStartTime,
        handleDrop,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        children,
    } = props;

    const onDragEnterCallback = React.useCallback(
        (dragData: DragData) => {
            if (handleDragEnter) {
                handleDragEnter();
            }
        },
        [handleDragEnter]
    );

    const onDragOverCallback = React.useCallback(
        (dragData: DragData) => {
            if (handleDragOver && canDrop(dragData)) {
                handleDragOver();
            }
        },
        [handleDragOver]
    );

    const onDropCallback = React.useCallback(
        (dragData: DragData, pageX: number, pageY: number, target?: HTMLElement) => {
            onDrop(dragData, dropTarget, selectedDate, generateStartTime, handleDrop);
        },
        [dropTarget, selectedDate, generateStartTime, handleDrop]
    );

    return (
        <Droppable
            dropViewState={dropViewState}
            canDrop={canDrop}
            onDragEnter={onDragEnterCallback}
            onDragOver={onDragOverCallback}
            onDragLeave={handleDragLeave}
            onDrop={onDropCallback}
            classNames={classNames}
            greedy={true}>
            {children}
        </Droppable>
    );
});

function canDrop(dragData: DragData): boolean {
    return dragData.itemType === DraggableItemTypes.MailListRow;
}

function onDrop(
    dragData: DragData,
    dropTarget: DropTarget,
    selectedDate?: OwaDate,
    generateStartTime?: (selectedDate?: OwaDate) => OwaDate,
    handleDrop?: () => void
): void {
    switch (dragData.itemType) {
        case DraggableItemTypes.MailListRow:
            const mailListDragData = dragData as MailListRowDragData;
            createEventFromMailItemDrop(
                mailListDragData,
                dropTarget,
                generateStartTime
                    ? generateStartTime(selectedDate)
                    : generateStartTimeDefault(selectedDate)
            );
            if (handleDrop) {
                handleDrop();
            }
            break;
    }
}

function generateStartTimeDefault(selectedDate?: OwaDate) {
    return selectedDate && getDefaultStart(selectedDate);
}
