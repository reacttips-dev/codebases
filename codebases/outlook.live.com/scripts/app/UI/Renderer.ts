/**
 * Renderer.ts
 *
 * Module for rendering the markup
 */

import { AttributeName, Tags } from "./UiConstants";

/**
 * Interface for an attribute
 */
export interface IAttribute {
	name: string;
	value: string;
}

/**
 * Interface for UI(HTML markup) as json
 */
export interface IUIAsJson {
	id?: string;
	tag?: string; // div by default
	classes?: string[]; // CSS class
	attributes?: IAttribute[];
	children?: IUIAsJson[];
	innerText?: string;
	innerHTML?: string;
	brs?: any; // should the element and its children be created? true by default
}

/**
 * Create DOM elements from Json structure
 * @param {UiAsJson} schema The Json structure
 * @param {boolean} svg Create svg element instead of html?
 * @return {HTMLElement} HTML elements with tree structure
 */
export function elementFromJson(schema: IUIAsJson, svg?: boolean): Element {
	if (typeof schema.brs === "undefined") {
		schema.brs = true;
	}

	if (!schema.brs) {
		return null;
	}

	if (!schema.tag) {
		schema.tag = Tags.Div;
	}

	let element: Element;

	if (schema.tag === Tags.Svg) {
		svg = true;
	}

	if (svg) {
		element = document.createElementNS("http://www.w3.org/2000/svg", schema.tag);
	} else {
		element = document.createElement(schema.tag);
	}

	if (schema.attributes) {
		let attribute: IAttribute;
		for (let i = 0; i < schema.attributes.length; i++) {
			attribute = schema.attributes[i];
			if (attribute.name === AttributeName.xlinkHref) {
				element.setAttributeNS("http://www.w3.org/1999/xlink", AttributeName.HRef, attribute.value);
			} else {
				element.setAttribute(attribute.name, attribute.value);
			}
		}
	}

	if (schema.id) {
		element.id = schema.id;
	}

	if (schema.classes) {
		let concatClasses: string = schema.classes.join(" ");
		if (svg) {
			element.setAttribute(AttributeName.Class, concatClasses);
		} else {
			element.className = concatClasses;
		}
	}

	if (schema.innerText && !svg) {
		element.textContent = schema.innerText;
	}

	if (schema.innerHTML && !svg) {
		element.innerHTML = schema.innerHTML;
	}

	if (schema.children) {
		for (let i = 0; i < schema.children.length; i++) {
			// Sometimes IE mis-reports length
			let cur: IUIAsJson = schema.children[i];

			if (cur) {
				let child: Element = elementFromJson(cur, svg);

				if (child) {
					element.appendChild(child);
				}
			}
		}
	}

	return element;
}
