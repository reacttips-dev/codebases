import { observer } from 'mobx-react-lite';
import type WellItemDragData from '../store/schema/WellItemDragData';
import DragAndDroppable from 'owa-dnd/lib/components/DragAndDroppable';
import type DragViewState from 'owa-dnd/lib/store/schema/DragViewState';
import type DropEffect from 'owa-dnd/lib/store/schema/DropEffect';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import { getStyles, DraggableItemStyle, DraggableItemStyleProps } from './DraggableItem.styles';
import { classNamesFunction } from '@fluentui/utilities';
import type WellDropViewState from '../store/schema/WellDropViewState';

import * as React from 'react';
const getClassNames = classNamesFunction<DraggableItemStyleProps, DraggableItemStyle>();
import classNamesUtil from 'classnames';

const DRAG_X_OFFSET = -10;
const DRAG_Y_OFFSET = 5;

export interface DraggableItemProps<T> {
    item: T;
    itemIndex: number;
    displayText: string;
    draggableItemType: string;
    dragViewState: DragViewState;
    dropViewState: WellDropViewState;
    removeDroppedItemAction: (item: T, shouldRemoveFromRight?) => void;
    canDrag: (item: T) => boolean;
    children?: React.ReactNode;
}

export default observer(function DraggableItem<T>(props: DraggableItemProps<T>) {
    const dragData = React.useRef<WellItemDragData>({
        itemType: props.draggableItemType,
        item: props.item,
        displayText: props.displayText,
    });
    const dropViewState = React.useRef<WellDropViewState>(
        props.dropViewState ? props.dropViewState : createDropViewState()
    );
    const isDropped = React.useRef<boolean>();
    const [isItemDraggedOver, setIsItemDraggedOver] = React.useState<boolean>(false);
    const onDragStart = (dragData: WellItemDragData, pageX: number, pageY: number) => {
        dropViewState.current.didDragStart = true;
    };
    const onDragEnd = (dragData: WellItemDragData, dropEffect?: DropEffect) => {
        dropViewState.current.didDragStart = false;
        // If succesfully dropped, the dropEffect should be set to 'move'
        if (dropEffect && dropEffect == 'move') {
            props.removeDroppedItemAction(props.item, dropViewState.current.shouldRemoveFromRight);
        }
    };
    const onDragOver = (dragInfo: WellItemDragData) => {
        isDropped.current = false;
        setIsItemDraggedOver(true);
    };
    const onDragLeave = (dragInfo: WellItemDragData) => {
        if (!isDropped.current) {
            dropViewState.current.dropItemIndex = -1;
        }
        setIsItemDraggedOver(false);
    };
    const onDrop = (dragInfo: WellItemDragData, pageX: number, pageY: number) => {
        isDropped.current = true;
        dropViewState.current.dropItemIndex = props.itemIndex;
    };
    const canDrag = (): boolean => {
        const { item } = props;
        return props.canDrag(item);
    };
    const getDragData = (): WellItemDragData => {
        return dragData.current;
    };
    const classNames = getClassNames(getStyles, {
        isItemDraggedOver,
        didDragStart: dropViewState.current ? dropViewState.current.didDragStart : false,
    });
    let draggedClass = '';
    return (
        <DragAndDroppable
            classNames={classNamesUtil(classNames.draggableContainer, draggedClass)}
            dragViewState={props.dragViewState}
            dropViewState={props.dropViewState}
            canDrag={canDrag}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            getDragData={getDragData}
            getDragPreview={getDragPreview}
            xOffset={DRAG_X_OFFSET}
            yOffset={DRAG_Y_OFFSET}
            onDragEnd={onDragEnd}>
            {props.children}
        </DragAndDroppable>
    );
});

function getDragPreview(dragData: WellItemDragData): HTMLElement {
    const elem = document.createElement('div');
    elem.innerText = dragData.displayText;
    return elem;
}
