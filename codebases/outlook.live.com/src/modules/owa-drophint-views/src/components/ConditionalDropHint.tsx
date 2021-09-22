import { observer } from 'mobx-react-lite';
import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import { getDraggedItemType } from 'owa-module-dnd-store';
import * as React from 'react';

export interface ConditionalDropHintProps {
    /** Standard content to render */
    children?: React.ReactNode;
    /** View to render when a DnD operation is in-progress  */
    dropHintView: JSX.Element;
    /** Type of drag item to support */
    dragItemType: string;
    /** Drop view state to listen to */
    dropViewState: DropViewState;
    /** Override for the standard logic deciding whether to show the drop hint or not */
    hideDropHintCondition?: boolean;
}

/**
 * Conditionally renders the wrapped content or the drop hint view, based on the configured props.
 * Includes support for dragging items across container boundaries governed by different stores.
 */
export default observer(function ConditionalDropHint(props: ConditionalDropHintProps) {
    const { children, dropViewState, dropHintView, dragItemType, hideDropHintCondition } = props;

    const showDropHint = !hideDropHintCondition && shouldShowDropHint(dragItemType, dropViewState);

    return (
        <>
            {showDropHint && dropHintView}
            {!showDropHint && children}
        </>
    );
});

/**
 * getDraggedItemType() will tell us the item being dragged across the hosted module, e.g. email in mail module.
 * Once the dragged email crosses out of the mail module boundary, onDragLeave of the mail module sets draggedItemType to null.
 * However, now it enters another surface, such as a flex panel so we the dropViewState prop can be used to keep tracking the itemType
 * to provide continuous tracking across boundaries.
 */
function shouldShowDropHint(dragItemType: string, dropViewState: DropViewState): boolean {
    return (
        shouldShowDropHintForItemType(getDraggedItemType(), dragItemType) ||
        shouldShowDropHintForItemType(dropViewState.draggableItemType, dragItemType)
    );
}

function shouldShowDropHintForItemType(draggedItemType: string, typeToDrag: string): boolean {
    return draggedItemType === typeToDrag;
}
