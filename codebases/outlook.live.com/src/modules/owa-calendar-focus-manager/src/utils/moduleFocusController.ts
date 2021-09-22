import {
    addOrUpdateStackEntry,
    FocusStackEntry,
    getTopStackEntry,
    isBasePopupRoot,
    isSamePopupRoot,
    removeStackEntry,
} from './focusStack';
import { getFirstFocusable, isElementTabbable } from '@fluentui/react/lib/Utilities';
import { initializeRootFocusListener } from './rootFocusListener';
import { initializeRootMutationObserver } from './rootMutationObserver';
import { trace } from 'owa-trace';

let preventFocusUntilNextRender: number = 0;
const DISABLE_FOCUS_TIMEOUT = 200;

/**
 * The purpose of this controller is to handle focus when mutliple popups get chained for opening and closing. The most basic example is a button that opens a popup,
 * which contains a button that opens another popup. When the first button gets clicked, focus goes to it. It then opens a popup, which can keep track of that before
 * setting focus inside itself. Clicking a second button in the popup sets focus to that button, which then opens another popup (setting focus to it) before closing the
 * first popup.
 * What should happen when the second (now only) popup closes? It wants to send focus back to wherever it was initially (inside the first popup), but since that popup
 * no longer exists, it doesn't know what to do. This scenario is exactly the case on our Calendar Surface, where clicking an item opens a peek, and opening the full
 * reading pane from there closes the peek.
 *
 * We make an assumption here that every popup is always appended directly to document.body. We call those popups a "popupRoot" because it can be anything- a popup, pane,
 * modal, context menu, etc, as long as it's appended to document.body we'll see it. Then we can use a focus "stack" of touples, mapping each popupRoot to the element
 * inside it that was last focused.
 *
 * We listen on the root of the page for focus events. This allows us to see when the focus changes, and update the entry for whatever popupRoot the focus happened on.
 * If we don't currently have an entry for that popupRoot, we can add a new one at the top of the stack.
 */

/**
 * This initializes the focus controller to listen to events on the root of the page. Whenever focus changes, the listeners keep track of which
 * parent node it belongs to and keeps the list in a stack. When a node gets removed from the root, if the focus was in that popup, it gets sent back
 * to the next element on the stack.
 */
export function initializeFocusController() {
    initializeRootMutationObserver(handleAddedNode, handleRemovedNode);
    initializeRootFocusListener(handleFocusInNewPopup);
}

/**
 * Prevent the focus controller from setting focus during the current render cycle.
 */
export function preventFocusDuringCurrentRender() {
    preventFocusUntilNextRender++;
    setTimeout(() => preventFocusUntilNextRender--, DISABLE_FOCUS_TIMEOUT);
}

/**
 * Returns whether the focus has moved into any popups
 */
export function isFocusAtStackRoot(): boolean {
    return isBasePopupRoot(getTopStackEntry());
}

/**
 * When a node gets added to the root of the page, it should be expected to handle setting the focus inside itself. So our handling for this case
 * is to just update the state so that we know a new node was added.
 * @param addedNode the node that was added
 */
function handleAddedNode(addedNode: HTMLElement) {
    // If a node was added during this render cycle, we assume it was a new popupRoot that will handle setting focus inside
    // itself. In that case, we want to disable setting focus until the next render cycle has finished, so use a setTimeout to delay resetting.
    preventFocusDuringCurrentRender();
}

/**
 * When a node gets removed from the DOM, assuming it was a popup root, we need to search the stack and remove
 * @param removedNode
 */
function handleRemovedNode(removedNode: HTMLElement) {
    let topStackEntry = getTopStackEntry();
    let entryToRemove = { popupRoot: removedNode, element: null, path: null, fullPath: null };

    // first remove the entry from the stack for the pane getting removed
    removeStackEntry(entryToRemove);

    if (isSamePopupRoot(topStackEntry, entryToRemove)) {
        // we're removing the popupRoot where focus currently resides, so we need to send focus back to the next
        // popupRoot in the list

        removeInvalidTopStackEntries();
        let newTop = getTopStackEntry();
        if (newTop) {
            handleSettingFocusToPopupRoot(newTop);
        }
    }
}

/**
 * Handles setting focus back to a specific popup root on the focus stack. Gets the root off of the stack,
 * then sends the focus to the element for that stack.
 * @param newTop the focus stack entry to send focus to
 */
function handleSettingFocusToPopupRoot(newTop: FocusStackEntry) {
    if (!newTop) {
        return;
    }

    let element = newTop.element;
    if (document.body.contains(element)) {
        // this is the common case- the element that we want to send focus to is still in the dom, so we can just focus it
        focusElement(element);
    } else {
        /*  this is a hard case. We know that the popupRoot we're currently on is closing. We also know which domElement
            the focus was on in the last popupRoot. But that dom element is no longer there.
            We don't want to just send focus back to document.body, so first we'll try to see if the item
            was just re-rendered- set up a query selector using all attributes of the current element, and then find all children
            that match it. If only one child, the element was unique so we'll use it as the new target. If not unique or no element found
            (the button might have been removed), then try using a query selector that encompasses the whole path from the top to the element,
            using the same attribute queries. This is a more complex query and more likely to break, so we'll still try to rely on the first
            check where possible, but can help with uniqueness when multiple items have entirely the same attributes.
        */
        let element = findElementUsingQuerySelector(newTop.path, newTop.popupRoot);
        if (element) {
            focusElement(element);
        } else {
            // if we didn't find a unique match using just the attributes, try using the full DOM path
            element = findElementUsingQuerySelector(newTop.fullPath, newTop.popupRoot);
            if (element) {
                focusElement(element);
            }
        }
    }
}

function findElementUsingQuerySelector(
    selector: string,
    rootElement: HTMLElement
): HTMLElement | null {
    let potentialNodes: NodeListOf<Element>;
    try {
        potentialNodes = rootElement.querySelectorAll(selector);
    } catch (err) {
        // if the querySelectorAll fails, when it throws it includes all the text that might have been included in the
        // DOM element. This might include PII, which we don't need and don't want to log. Log a generic error instead
        trace.warn('moduleFocusController: Error selecting for elements, will not set focus');
    }

    if (potentialNodes && potentialNodes.length == 1) {
        // we found the unique item
        return potentialNodes.item(0) as HTMLElement;
    }
    return null;
}

/**
 * Search up the stack of elements to find the first actual tabbable parent and try to focus it. This is necessary because in IE11, the document.activeElement
 * and the ev.target of focus events isn't necessarily a tabbable element, it might be an inner element (in other browsers it's always the tabbable element)
 * @param element the element target to try to focus
 */
function focusElement(element: HTMLElement) {
    let parent = element;
    while (parent && parent != document.body) {
        let firstFocusable = getFirstFocusable(
            parent,
            parent,
            true /* includeElementsInFocusZones */
        );
        if (firstFocusable && isElementTabbable(firstFocusable)) {
            // use a setTimeout so we're sure the render cycle has finished
            setTimeout(() => {
                if (preventFocusUntilNextRender == 0) {
                    firstFocusable.focus({ preventScroll: !isFocusVisible() });
                }
            }, 0);
            return;
        }
        parent = parent.parentElement;
    }
}

/**
 * Handles updating the focus stack when focus moves inside of a popup, or to a new popup. If focus moves inside
 * an existing popup, updates the target of that popup in the stack to the new target. If focus moves to a new popup,
 * makes sure that popup gets pushed onto the stack with it's target
 * @param target the target of the focus event
 * @param targetPopupRoot the node for the root of the new pane
 */
function handleFocusInNewPopup(target: HTMLElement, targetPopupRoot: HTMLElement): void {
    let stackEntry = {
        popupRoot: targetPopupRoot,
        element: target,
        fullPath: createQuerySelectorForElementPath(target, targetPopupRoot),
        path: createQuerySelectorForElement(target),
    };
    removeInvalidTopStackEntries();

    preventFocusDuringCurrentRender();
    removeStackEntry(stackEntry);
    addOrUpdateStackEntry(stackEntry);
}

/**
 * Starts from the top of the stack and removes panes that aren't still contained in the document
 */
function removeInvalidTopStackEntries(): void {
    let top = getTopStackEntry();
    while (top) {
        if (
            document.body.contains(top.popupRoot) &&
            getFirstFocusable(top.popupRoot, top.popupRoot, true /* includeElementsInFocusZones */)
        ) {
            // this entry is valid
            return;
        } else {
            removeStackEntry(top);
            top = getTopStackEntry();
        }
    }
}

/**
 * Returns whether focus outlines are currently visible. If not visible, focus changes should not cause scrolls
 */
function isFocusVisible(): boolean {
    return document.body.classList.contains('ms-Fabric--isFocusVisible');
}

/**
 * Creates a query selector for targetting the given element using all attributes on that element
 * @param element
 */
function createQuerySelectorForElement(
    element: HTMLElement,
    attributesToIgnore?: string[]
): string {
    let selector = element.tagName;
    for (let i = 0; i < element.attributes.length; i++) {
        let attribute = element.attributes[i];

        if (attributesToIgnore?.includes(attribute.name)) {
            continue;
        }

        // replace characters that can't be parsed as is: '\'
        let temporaryValue = attribute.value.replace('\\', '\\\\');

        if (temporaryValue.length === 0) {
            continue;
        }

        // For the characters to split by, we can separate a querySelector into two substring searches, like "[title*=text\nmoreText]" can be split into
        // "[title*=text][title*=moreText]". For any extra breaking characters, just add to the replace regex
        temporaryValue = temporaryValue.replace(/[\n']/g, "'][" + attribute.name + "*='");
        let query = '[' + attribute.name + "*='" + temporaryValue + "']";
        selector = selector.concat(query);
    }

    return selector;
}

/**
 * Creates a query selector for uniquely targetting the given element by recursively generating selectors for the
 * DOM hierarchy all the way from document.body to the element. Useful for uniquely identifying which of multiple possible
 * elements match a given single target if all attributes are the same, because the path should be unique.
 * @param element
 */
function createQuerySelectorForElementPath(element: HTMLElement, popupRoot: HTMLElement): string {
    let el = element;
    let selector = '';
    // when trying to make a query selector through an entire tree of DOM elements, we want to remove attributes that are subject to change dynamically.
    // While technically most attributes could change dynamically, this list should definitely be removed because these attributes change frequently.
    const attributesToIgnore = ['class', 'style'];
    while (el !== popupRoot) {
        // selector 'element1 element2' = selects all element2s inside element1s
        selector = ` ${createQuerySelectorForElement(el, attributesToIgnore)}` + selector;
        el = el.parentElement;
    }
    return selector;
}
