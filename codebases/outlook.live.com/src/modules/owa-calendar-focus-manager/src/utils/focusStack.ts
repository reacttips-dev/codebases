export interface FocusStackEntry {
    popupRoot: HTMLElement;
    element: HTMLElement;
    path: string;
    fullPath: string;
}

let focusStack: FocusStackEntry[] = [];

/**
 * Checks whether the two given entries correspond to the same popup. Does so by comparing the popup roots
 * @param stackEntry first entry to compare
 * @param entryToCompare second entry to compare
 * @returns true if the entries have the same root, false if not or if either given entry is undefined
 */
export function isSamePopupRoot(
    stackEntry: FocusStackEntry,
    entryToCompare: FocusStackEntry
): boolean {
    if (!stackEntry && !entryToCompare) {
        return true;
    }

    if (!stackEntry || !entryToCompare) {
        return false;
    }

    return stackEntry.popupRoot == entryToCompare.popupRoot;
}

/**
 * Checks whether the given stack entry is at the base of the focus stack
 * @param stackEntry the stack entry to check against the base
 * @returns true if the given entry is at the base of the stack
 */
export function isBasePopupRoot(stackEntry: FocusStackEntry): boolean {
    return isSamePopupRoot(focusStack[0], stackEntry);
}

/**
 * Updates an existing entry for a popup root with the new target or, if the popup root doesn't yet exist in the stack,
 * pushes it on top
 * @param entry the entry to update or push to the top
 */
export function addOrUpdateStackEntry(entry: FocusStackEntry): FocusStackEntry {
    let existingPopupRoot = false;
    for (let focusStackIndex = focusStack.length - 1; focusStackIndex >= 0; focusStackIndex--) {
        let value = focusStack[focusStackIndex];
        if (value.popupRoot == entry.popupRoot) {
            focusStack[focusStackIndex] = entry;
            existingPopupRoot = true;
        }
    }

    if (!existingPopupRoot) {
        focusStack.push(entry);
    }

    return entry;
}

/**
 * removes the given popup root from the stack
 * @param entry the entry to remove. Checks for popupRoot property equality, not element equality
 * @returns true if the element was there to be removed, else false
 */
export function removeStackEntry(entry: FocusStackEntry): boolean {
    for (let focusStackIndex = focusStack.length - 1; focusStackIndex >= 0; focusStackIndex--) {
        let value = focusStack[focusStackIndex];
        if (value.popupRoot == entry.popupRoot) {
            focusStack.splice(focusStackIndex, 1);
            return true;
        }
    }
    return false;
}

/**
 * Gets the focus stack entry at the top of the stack. Does not remove from the stack.
 */
export function getTopStackEntry(): FocusStackEntry {
    return focusStack[focusStack.length - 1];
}
