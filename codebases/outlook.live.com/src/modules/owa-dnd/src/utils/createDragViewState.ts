import type DragViewState from '../store/schema/DragViewState';

export default function createDragViewState(): DragViewState {
    return {
        isBeingDragged: false,
    };
}
