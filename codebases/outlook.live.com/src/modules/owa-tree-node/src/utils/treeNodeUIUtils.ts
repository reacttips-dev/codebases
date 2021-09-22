/**
 * This function returns the UI depth of a tree node in pixels. Although a node might be at depth 1,
 * it should be aligned to the root node at depth 0 per redlines. Thus, all other levels should
 * also be decreased by 1 level for the UI only.
 * @param hasIconsForAllFolders A boolean passed in if all folders have icons.
 */
export function getUITreeNodeDepth(depth: number, hasIconsForAllFolders?: boolean) {
    const depthFactor = hasIconsForAllFolders ? 21 : 8;
    return Math.max(0, depth - 1) * depthFactor;
}

/**
 * Returns the right side padding for a tree node (in LTR mode) and left side padding (in RTL mode)
 */
export function getTreeNodesFarPadding() {
    return '28px';
}
