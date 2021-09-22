import type { DragData } from './dragDataUtil';
import { DraggableItemTypes } from './DraggableItemTypes';

export interface LocalFilesDragData extends DragData {
    files: FileList;
}

export default function getLocalFilesDragData(files: FileList): LocalFilesDragData {
    return {
        itemType: DraggableItemTypes.LocalFile,
        files: files,
    };
}
