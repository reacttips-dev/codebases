/**
 * Utils.ts
 *
 * Module for utility functions
 */

import { Classes } from "./UiConstants";
import * as Screenshot from "./../Screenshot";
import * as Logging from "./../Logging/Logging";

/**
 * Set HTML element visibility
 * @param {string} id The Id of the HTML element
 * @param {any} vis The visibility to be set (true or false)
 * @return {void}
 */
export function setElementVisibility(id: string, vis: boolean): void {
	let oldClassName: string = vis ? Classes.Hidden : Classes.Visible;
	let newClassName: string = vis ? Classes.Visible : Classes.Hidden;

	replaceClassesById(id, oldClassName, newClassName);
}

/**
 * Delete HTML element by Id
 * @param {string} id The Id of the HTML element
 * @return {void}
 */
export function deleteElementById(id: string): void {
	let element: HTMLElement = document.getElementById(id);
	if (element != null && element.parentNode != null) {
		element.parentNode.removeChild(element);
	}
}

/**
 * Add a CSS class to an HTML element by Id
 * @param {string} id The Id of the HTML element
 * @param {string} newClassName The name of CSS class to be added
 * @return {void}
 */
export function addClassById(id: string, newClass: string): void {
	let element: HTMLElement = document.getElementById(id);

	if (!element) {
		return;
	}

	// check is the class already exists, if not add it
	if (!element.className.match(new RegExp("\\b" + newClass + "\\b"))) {
		// we use className instead of classList to support IE9
		element.className = element.className + " " + newClass;
	}
}

/**
 * Delete a CSS class of an HTML element by Id
 * @param {string} id The Id of the HTML element
 * @param {string} oldClassName The name of CSS class to be deleted
 * @return {void}
 */
export function deleteClassById(id: string, oldClass: string): void {
	let element: HTMLElement = document.getElementById(id);

	if (!element) {
		return;
	}

	// we use className instead of classList to support IE9
	// get rid of any occurrences of the class we don"t want
	element.className = element.className.split(new RegExp("\\b" + oldClass + "\\b", "i")).join(" ");

	// get rid of extra whitespaces
	element.className = element.className.split(/\s+/).join(" ");
}

/**
 * Delete an CSS class and (or) add an CSS class to an HTML element by Id
 * @param {string} id The Id of the HTML element
 * @param {string} oldClassName The name of CSS class to be deleted
 * @param {string} newClassName The name of CSS class to be added
 * @return {void}
 */
export function replaceClassesById(id: string, oldClassName?: string, newClassName?: string): void {
	deleteClassById(id, oldClassName);
	addClassById(id, newClassName);
}

/**
 * Set attribute on an HTML element
 * @param {string} id The Id of the HTML element
 * @param {string} attriName The attribute name
 * @param {string} attriValue The attribute value
 * @return {void}
 */
export function setAttributeOnHtmlElement(id: string, attriName: string, attriValue: string): void {
	let htmlElement: HTMLElement = <HTMLElement> document.getElementById(id);
	if (htmlElement) {
		htmlElement.setAttribute(attriName, attriValue);
	}
}

/**
 * Add event listener helper function (wrapper) that deals with IE 8 compatability
 * @param object The object to add event listener to
 * @param type The event type
 * @param listener The listener function
 */
export function addEventListenerHelper(object: any, type: string, listener: (event: Event) => void): void {
	if (object.addEventListener) {
		object.addEventListener(type, listener, false);
	} else if (object.attachEvent) {
		object.attachEvent("on" + type, listener);
	}
}

/**
 * Remove event listener helper function (wrapper) that deals with IE 8 compatability
 * @param object The object to remove event listener from
 * @param type The event type
 * @param listener The listener function
 */
export function removeEventListenerHelper(object: any, type: string, listener: (event: Event) => void): void {
	if (object.removeEventListener) {
		object.removeEventListener(type, listener, false);
	} else if (object.detachEvent) {
		object.detachEvent("on" + type, listener);
	}
}

/**
 * Register event listener
 * @param id The Id of the HTML element
 * @param type The event type
 * @param listener The listener function
 */
export function registerListener(id: string, type: string, listener: (event: Event) => void): void {
	let element: HTMLElement = document.getElementById(id);
	if (element) {
		addEventListenerHelper(element, type, listener);
	}
}

/**
 * Register event listener
 * @param element The HTML element
 * @param type The event type
 * @param listener The listener function
 */
export function registerListenerToElement(element: HTMLElement, type: string, listener: (event: Event) => void): void {
	if (element) {
		addEventListenerHelper(element, type, listener);
	}
}

/**
 * Un-register event listener
 * @param id The Id of the HTML element
 * @param type The event type
 * @param listener The listener function
 */
export function unregisterListener(id: string, type: string, listener: (event: Event) => void): void {
	let element: HTMLElement = document.getElementById(id);
	if (element) {
		removeEventListenerHelper(element, type, listener);
	}
}

/**
 * Returns the version of Internet Explorer or -1 for non-IE browser
 * @return {number} The IE version
 */
export function getInternetExplorerVersion(): number {
	let rv: number = -1;
	let ua: string = window.navigator.userAgent;

	// since IE 11, 'MSIE' is not a keyword in its user agent string anymore
	// determine whether the browser is IE or not, and the version of IE based on Trident keyword and its version
	if (ua.indexOf("Trident") > -1) {
		let re: RegExp = new RegExp("Trident/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			rv = parseFloat(RegExp.$1);
			rv += 4; // trident version + 4 is the IE version
		}
	}
	return rv;
}

/**
 * Check if the current text direction is right to left
 */
export function isRightToLeft(): boolean {
	return getComputedStyle(document.documentElement).direction === "rtl";
}

/**
 * Screenshot preview is control by screenshot check box. Populate preview if checkbox is checked 
 * @param screenshotCheckboxId The Id of screenshot checkbox 
 * @param screenshotPreviewId The Id of preview 
 */
export function ScreenshotPreviewByCheckbox(screenshotCheckboxId: string, screenshotPreviewId: string): void {
	let screenshotCheckBox = <HTMLInputElement> document.getElementById(screenshotCheckboxId);
	let screenshotCheckBoxSelected: boolean = screenshotCheckBox && screenshotCheckBox.checked;
	let preview = <HTMLImageElement> document.getElementById(screenshotPreviewId);

	if (screenshotCheckBoxSelected) {
		setElementVisibility(screenshotPreviewId, true);
		let startTime: number = performance.now();
		Screenshot.createScreenshot(document.body).then(
			(canvas: HTMLCanvasElement) => {
				let endTime: number = performance.now();
				Logging.getLogger().logEvent(Logging.EventIds.Shared.Screenshot.Render.Success.VALUE,
					Logging.LogLevel.Critical,
					{ TimeMilliseconds: endTime - startTime });

				preview.src = canvas.toDataURL();
			}
		).catch((error: any) => {
			let endTime: number = performance.now();
			Logging.getLogger().logEvent(Logging.EventIds.Shared.Screenshot.Render.Failed.VALUE,
				Logging.LogLevel.Error,
				{ ErrorMessage: error, TimeMilliseconds: endTime - startTime });
		});
	} else {
		setElementVisibility(screenshotPreviewId, false);
	}
}
