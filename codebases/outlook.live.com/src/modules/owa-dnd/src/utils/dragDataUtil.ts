let dragItemType: string;
let dragItemData: unknown;
let dropEffect: string;

export interface DragData {
    itemType: string;
    itemData?: unknown;
}

// We are currently just storing the dragType and dropEffect for IE/Edge scenarios
// For dragType, They do not support custom MIME types, so we do this so we can highlight droppable targets to the user.
// For dropEffect, There is a bug where ondragend's dropEffect is always set to 'none', so we set it manually.
//
// We also store dragTypeData to allow transferring additional information from drag item to drop target
// when both ends of the drag-and-drop operation exist in the same JS context / HTML document
// When doing cross-window drag-and-drop, the data will not be populated
export function setDragItemDetails(itemType: string, itemData: unknown): void {
    dragItemType = itemType;
    dragItemData = itemData;
}

export function getDragItemType(): string {
    return dragItemType;
}

export function getDragItemData(): unknown {
    return dragItemData;
}

export function setDropEffect(effect: string): void {
    dropEffect = effect;
}

export function getDropEffect(): string {
    return dropEffect;
}
