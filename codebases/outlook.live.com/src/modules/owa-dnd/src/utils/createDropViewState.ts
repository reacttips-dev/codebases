import type DropViewState from '../store/schema/DropViewState';

export default function createDropViewState(): DropViewState {
    return {
        isDragOver: false,
        draggableItemType: null,
    };
}
