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


const SPACE = ' ';
const RE_CLASS = /[\n\t\r]+/g;

let norm = elemClass => (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);

export function addClass(elem, className) {
	if (elem.classList) {
		elem.classList.add(...className.split(' '));
	} else {
		elem.className += ' ' + className;
	}
}

export function removeClass(elem, needle) {
	needle = needle.trim();
	if (elem.classList) {
		elem.classList.remove(...needle.split(' '));
	} else {
		let elemClass = elem.className.trim();
		let className = norm(elemClass);
		needle = SPACE + needle + SPACE;
		while (className.indexOf(needle) >= 0) {
			className = className.replace(needle, SPACE);
		}
		elem.className = className.trim();
	}
}
