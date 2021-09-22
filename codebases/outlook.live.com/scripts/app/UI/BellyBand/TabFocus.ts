/**
 * TabFocus.ts
 *
 * Module to handle tab and shift tab focus
 */

import { Classes, IDs } from "./../UiConstants";

/**
 * Keeps tabs and shift tabs focus on visible elements of the feedback dialog
 * This prevents tabs and shift tabs cycle focus to elements of the background main page.
 * @param focusedElement The in-focus element object
 */
export function cycleTabFocus(focusedElement: Element): void {
	let elements = getTabbableElements();

	// when a tab lands on the last dummy tabbable element, set focus to the first
	// visible element which is the one after the first dummy tabbable element
	if (focusedElement.id === IDs.LastTabbable) {
		for (let i = 0; i < elements.length; i++) {
			let element = (<HTMLElement> elements[i]);

			if (element.id === IDs.FirstTabbable || !checkVisible(element)) {
				continue;
			}

			element.focus();
			return;
		}
		// when a shift tab lands on the first dummy tabbable element, set focus to the last
		// visible element which is the one before the last dummy tabbable element
	} else if (focusedElement.id === IDs.FirstTabbable) {
		for (let i = elements.length - 1; i >= 0; i--) {
			let element = (<HTMLElement> elements[i]);

			if (element.id === IDs.LastTabbable || !checkVisible(element)) {
				continue;
			}

			element.focus();
			return;
		}
	}
}

/**
 * Returns a list of tabbable elements.
 * @returns {NodeListOf<Element>} list of tabbable elements
 */
function getTabbableElements(): NodeListOf<Element> {
	const tabbableSelector = "a[href], area[href], input:not([disabled]):not([tabindex=\'-1\']), " +
		"button:not([disabled]):not([tabindex=\'-1\']), select:not([disabled]):not([tabindex=\'-1\']), " +
		"textarea:not([disabled]):not([tabindex =\'-1\']), " +
		"object, *[tabindex]:not([tabindex=\'-1\']), *[contenteditable=true]";

	return document.getElementById(IDs.MainContainer).querySelectorAll(tabbableSelector);
}

/**
 * Returns visibility of an element by inspecting the element's parent class name for visible/hidden value.
 * Walk up the parent chain if needed.
 * @param element The element object
 * @returns {Boolean} whether the element is visible
 */
function checkVisible(element: HTMLElement): boolean {
	if (!element.parentElement) {
		return false;
	}

	// don't bother if parent element id is just whitespace or empty
	if (/\S/.test(element.parentElement.id)) {
		if (element.parentElement.className.indexOf(Classes.Visible) >= 0) {
			return true;
		}

		if (element.parentElement.className.indexOf(Classes.Hidden) >= 0) {
			return false;
		}
	}

	return checkVisible(element.parentElement);
}
