const _ = require('lodash');

let lastTime = 0;

const browserFPS = 60;
const frameTimeout = Math.floor(1000 / browserFPS);
const now = function() {
	if (window.performance) {
		return window.performance.now();
	}

	if (Date.now) {
		return Date.now();
	}

	return new Date().getTime();
};
const withSuffix = function(suffix) {
	return function(prefix) {
		return prefix + suffix;
	};
};
const findGlobal = function(possibleMethods) {
	return _.reduce(
		possibleMethods,
		function(raf, method) {
			return raf || window[method];
		},
		null
	);
};
const fakeRequest = function(callback) {
	const currTime = now();
	const timeToCall = Math.max(0, frameTimeout - (currTime - lastTime));
	const id = setTimeout(_.partial(callback, currTime + timeToCall), timeToCall);

	lastTime = currTime + timeToCall;

	return id;
};
const fakeCancel = function(id) {
	clearTimeout(id);
};
const vendors = ['ms', 'moz', 'webkit', 'o'];
const vendorsRequestNames = ['requestAnimationFrame'].concat(
	_.map(vendors, withSuffix('RequestAnimationFrame'))
);
const vendorsCancelNames = ['cancelAnimationFrame'].concat(
	_.map(vendors, withSuffix('CancelAnimationFrame'))
);

const request = findGlobal(vendorsRequestNames) || fakeRequest;
const cancel = findGlobal(vendorsCancelNames) || fakeCancel;

module.exports = {
	request: _.bind(request, window),
	cancel: _.bind(cancel, window)
};
