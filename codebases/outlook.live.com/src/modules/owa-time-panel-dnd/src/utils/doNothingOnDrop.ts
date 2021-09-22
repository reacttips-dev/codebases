import type { DragData } from 'owa-dnd';

export function doNothingOnDrop(
    dragInfo: DragData,
    pageX: number,
    pageY: number,
    target?: HTMLElement
) {
    return;
}
