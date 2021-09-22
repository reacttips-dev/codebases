/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *	Additional credit to the Author of rc-css-transition-group: https://github.com/yiminghe
 *	File originally extracted from the React source, converted to ES6 by https://github.com/developit
 */


/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
const EVENT_NAME_MAP = {
	transitionend: {
		transition: 'transitionend',
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'mozTransitionEnd',
		OTransition: 'oTransitionEnd',
		msTransition: 'MSTransitionEnd'
	},

	animationend: {
		animation: 'animationend',
		WebkitAnimation: 'webkitAnimationEnd',
		MozAnimation: 'mozAnimationEnd',
		OAnimation: 'oAnimationEnd',
		msAnimation: 'MSAnimationEnd'
	}
};

let endEvents = [];

function detectEvents() {
	let testEl = document.createElement('div'),
		style = testEl.style;

	// On some platforms, in particular some releases of Android 4.x,
	// the un-prefixed "animation" and "transition" properties are defined on the
	// style object but the events that fire will still be prefixed, so we need
	// to check if the un-prefixed events are useable, and if not remove them
	// from the map
	if (!('AnimationEvent' in window)) {
		delete EVENT_NAME_MAP.animationend.animation;
	}

	if (!('TransitionEvent' in window)) {
		delete EVENT_NAME_MAP.transitionend.transition;
	}

	for (let baseEventName in EVENT_NAME_MAP) {  // eslint-disable-line guard-for-in
		let baseEvents = EVENT_NAME_MAP[baseEventName];
		for (let styleName in baseEvents) {
			if (styleName in style) {
				endEvents.push(baseEvents[styleName]);
				break;
			}
		}
	}
}

if (typeof window !== 'undefined') {
	detectEvents();
}

export { endEvents };

export function addEndEventListener(node, eventListener) {
	if (!endEvents.length) {
		// If CSS transitions are not supported, trigger an "end animation" event immediately.
		return window.setTimeout(eventListener, 0);
	}
	endEvents.forEach( endEvent => {
		node.addEventListener(endEvent, eventListener, false);
	});
}

export function removeEndEventListener(node, eventListener) {
	if (!endEvents.length) return;
	endEvents.forEach( endEvent => {
		node.removeEventListener(endEvent, eventListener, false);
	});
}
