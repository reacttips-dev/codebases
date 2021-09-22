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

import { getKey } from './util';


// look for a needle in a haystack
function find(arr, iter) {
	for (let i=arr.length; i--; ) {
		if (iter(arr[i])) return true;
	}
	return false;
}


export function inChildrenByKey(children, key) {
	return find(children, c => getKey(c)===key);
}

export function inChildren(children, child) {
	return inChildrenByKey(children, getKey(child));
}


export function isShownInChildrenByKey(children, key, showProp) {
	return find(children, c => (
		getKey(c)===key && c.props[showProp]
	));
}

export function isShownInChildren(children, child, showProp) {
	return isShownInChildrenByKey(children, getKey(child), showProp);
}


export function mergeChildMappings(prev, next) {
	let ret = [];

	// For each key of `next`, the list of keys to insert before that key in
	// the combined list
	let nextChildrenPending = {},
		pendingChildren = [];
	prev.forEach( c => {
		let key = getKey(c);
		if (inChildrenByKey(next, key)) {
			if (pendingChildren.length) {
				nextChildrenPending[key] = pendingChildren;
				pendingChildren = [];
			}
		}
		else {
			pendingChildren.push(c);
		}
	});

	next.forEach( c => {
		let key = getKey(c);
		if (nextChildrenPending.hasOwnProperty(key)) {
			ret = ret.concat(nextChildrenPending[key]);
		}
		ret.push(c);
	});

	return ret.concat(pendingChildren);
}
