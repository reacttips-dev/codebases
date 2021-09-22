import type DragViewState from '../store/schema/DragViewState';
import { mutatorAction } from 'satcheljs';

// Set Drag state, should be called only from Draggable component
export default mutatorAction(
    'setDragState',
    function (viewState: DragViewState, isBeingDragged: boolean): void {
        viewState.isBeingDragged = isBeingDragged;
    }
);
