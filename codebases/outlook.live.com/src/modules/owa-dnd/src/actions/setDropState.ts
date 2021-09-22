import type DropViewState from '../store/schema/DropViewState';
import { mutatorAction } from 'satcheljs';

// Set Drop state, should be called only from Droppable component
export default mutatorAction(
    'setDropState',
    function (viewState: DropViewState, isDragOver: boolean, draggableItemType: string): void {
        viewState.isDragOver = isDragOver;
        viewState.draggableItemType = draggableItemType;
    }
);
