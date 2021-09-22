let rootMutationObserver: MutationObserver;

/**
 * Handles setting up an observer for when new popups open or close, and fires the given callback functions
 * @param handleAddedPopup callback to fire when a popup is added. passes the HTMLElement for the root DOM node of the new popup
 * @param handleRemovedPopup callback to fire when a popup is removed. passes the HTMLElement for the root DOM node of the old popup
 */
export function initializeRootMutationObserver(
    handleAddedPopup: (element: HTMLElement) => void,
    handleRemovedPopup: (element: HTMLElement) => void
) {
    // we use a mutation observer to see when children get added/removed from the body of the document (as with new modals or panes)
    // when nodes get removed from the root, we can check to see if that node corresponded to the top of our focus stack
    // if so, we know we were focused in that node, and it's removal means we need to update the stack, and send focus back to the next node
    if (!rootMutationObserver) {
        rootMutationObserver = new MutationObserver((mutationList: MutationRecord[]) => {
            mutationList.forEach(mutationRecord => {
                let removedNodes = mutationRecord.removedNodes;
                let addedNodes = mutationRecord.addedNodes;
                for (let i = 0; i < addedNodes.length; i++) {
                    let addedNode: HTMLElement = addedNodes.item(i) as HTMLElement;
                    handleAddedPopup(addedNode);
                }
                for (let i = 0; i < removedNodes.length; i++) {
                    let removedNode: HTMLElement = removedNodes.item(i) as HTMLElement;
                    handleRemovedPopup(removedNode);
                }
            });
        });
    }
    // call disconnect just to clean up any existing connections, in case the whole document has rerendered and we have invalid connections
    rootMutationObserver.disconnect();
    // observe only childList, not the whole tree - we only care about updates to the root itself (hence subtree=false)
    let options: MutationObserverInit = {
        childList: true,
        subtree: false,
    };
    rootMutationObserver.observe(document.body, options);
}
