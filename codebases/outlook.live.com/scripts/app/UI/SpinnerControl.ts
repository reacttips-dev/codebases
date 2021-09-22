/**
 * Spinner.ts
 *
 * A module for a spinner.
 */

import { Classes } from "./UiConstants";
import * as Utils from "./Utils";

interface ICircleObject {
	element: HTMLDivElement;
	j: number;
}

const animationSpeed = 90;
const numCircles = 8;
const offsetSize = 0.2;
const parentSize = 34;
const fadeIncrement = 1 / numCircles;

export class Spinner {
	private circleObjects: ICircleObject[] = [];
	private interval: ReturnType<typeof setInterval>;
	private spinnerId: string;
	private spinner: HTMLElement;

	/**
	 * Constructor
	 * @param id id of the element to attach the spinner to
	 */
	constructor(id: string) {
		this.spinnerId = id;
		this.spinner = document.getElementById(this.spinnerId);
		this.createCirclesAndArrange();
		this.initializeOpacities();
		this.start();
		Utils.setElementVisibility(id, true);
	}

	/**
	 * Destroys the spinner
	 */
	public destroy() {
		Utils.setElementVisibility(this.spinnerId, false);
		this.stop();
	}

	/**
	 * Starts the animation
	 */
	private start() {
		this.stop();
		this.interval = setInterval(() => {
			let i = this.circleObjects.length;
			while (i--) {
				fade(this.circleObjects[i]);
			}
		},
			animationSpeed);
	}

	/**
	 * Stops the animation
	 */
	private stop() {
		clearInterval(this.interval);
	}

	private createCirclesAndArrange() {
		let angle = 0;
		let offset = parentSize * offsetSize;
		let step = (2 * Math.PI) / numCircles;
		let i = numCircles;
		let circleObject: ICircleObject;
		let radius = (parentSize - offset) * 0.5;

		while (i--) {
			let circle: HTMLDivElement = createCircle();
			let x = Math.round(parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
			let y = Math.round(parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
			this.spinner.appendChild(circle);
			circle.style.left = x + "px";
			circle.style.top = y + "px";
			angle += step;
			circleObject = { element: circle, j: i };
			this.circleObjects.push(circleObject);
		}
	}

	private initializeOpacities() {
		let i = 0;
		let j = 1;
		let opacity: number;

		for (i; i < numCircles; i++) {
			let circleObject = this.circleObjects[i];
			opacity = (fadeIncrement * j++);
			setOpacity(circleObject.element, opacity);
		}
	}
}

function fade(circleObject: any) {
	let opacity = getOpacity(circleObject.element) - fadeIncrement;

	if (opacity <= 0) {
		opacity = 1;
	}

	setOpacity(circleObject.element, opacity);
}

function getOpacity(element: HTMLDivElement) {
	return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
}

function setOpacity(element: HTMLDivElement, opacity: number) {
	element.style.opacity = opacity.toString();
}

function createCircle(): HTMLDivElement {
	let circle: HTMLDivElement = document.createElement("div");
	circle.classList.add(Classes.SpinnerCircle);
	circle.style.width = circle.style.height = parentSize * offsetSize + "px";
	return circle;
}
