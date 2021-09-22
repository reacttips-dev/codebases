import { isElementTabbable } from '@fluentui/react/lib/Utilities';

/**
 * Initializes a listener for all global focus events and fires the given callback function when focus is being moved
 * inside of a new popup
 * @param handleFocusInNewPopup the callback fired when focus moves inside a popup. target is the target for the focus event, popupRoot is the node
 * for the root of the popup
 */
export function initializeRootFocusListener(
    handleFocusInNewPopup: (target: HTMLElement, popupRoot: HTMLElement) => void
) {
    // register a window listener for onFocus events
    window.addEventListener(
        'focus',
        ev => {
            // filter out invalid focus events that we don't care about
            if (shouldIgnore(ev)) {
                return;
            }

            let targetPopupRoot = getPopupRoot(ev.target as HTMLElement);
            // Safari sometimes incorrectly sets the target as the non-focusable container
            let target = (isElementTabbable(ev.target as HTMLElement)
                ? ev.target
                : ev.relatedTarget) as HTMLElement;

            if (target != null) {
                handleFocusInNewPopup(ev.target as HTMLElement, targetPopupRoot);
            }
        },
        true /* capture phase so the focus events don't get stopped before we see them*/
    );
}

/**
 * Checks whether the given focus event was invalid
 * @param ev the focusEvent
 * @returns true if invalid, else false
 */
function shouldIgnore(ev: FocusEvent): boolean {
    if (ev.target == window) {
        // ignore top level window focusing
        return true;
    }

    if (
        (ev.target == document.body || !document.body.contains(ev.target as HTMLElement)) &&
        !isElementTabbable(ev.target as HTMLElement)
    ) {
        // we never really want to send focus to the root or anything above it on purpose. IE11
        // likes to fire these events, so we actually want to cancel them since the body isn't tabbable anyway
        ev.preventDefault();
        return true;
    }

    return false;
}

/**
 * Finds the top level node still beneath document body that this child element belongs to. Under our assumptions,
 * this is the root of a new popup.
 * @param childElement the child element inside a popup root
 */
function getPopupRoot(childElement: HTMLElement): HTMLElement {
    if (childElement == document.body || childElement.contains(document.body)) {
        return null;
    }

    let popupRoot = childElement;
    while (popupRoot?.parentElement && popupRoot.parentElement != document.body) {
        popupRoot = popupRoot.parentElement;
    }
    return popupRoot;
}
