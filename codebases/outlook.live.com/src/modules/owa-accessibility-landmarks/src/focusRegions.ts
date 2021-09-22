import selectNodesWithRelativePosition from './selectNodesWithRelativePosition';
import getLandmarkNodes from './getLandmarkNodes';
import getRole from './getRole';

export function focusNextRegion() {
    const focusable = selectNodesWithRelativePosition(
        getLandmarkNodes(),
        'after',
        document.activeElement
    ).filter(getRole)[0];
    return focusable && focusable.focus();
}
export function focusPreviousRegion() {
    const focusable = selectNodesWithRelativePosition(
        getLandmarkNodes(),
        'before',
        document.activeElement
    )
        .filter(getRole)
        .reverse()[0];
    return focusable && focusable.focus();
}
