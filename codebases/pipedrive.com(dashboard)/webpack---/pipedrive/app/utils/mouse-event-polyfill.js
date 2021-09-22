const _ = require('lodash');
const trueAsDefault = function trueAsDefault(val) {
	return _.isUndefined(val) ? true : !!val;
};
const toBool = function toBool(val) {
	return !!val;
};
const applyDefault = function applyDefault(val, defaultValue) {
	return val || defaultValue;
};
const makeNativeMouseEvent = function makeNativeMouseEvent(type, specs) {
	return new MouseEvent(type, specs);
};
const makeFakeMouseEvent = function makeFakeMouseEvent(type, specs) {
	const event = document.createEvent('MouseEvents');
	const bubbles = trueAsDefault(specs.bubbles, true);
	const cancelable = trueAsDefault(specs.cancelable, true);
	const view = specs.view;
	const detail = applyDefault(specs.detail, 0);
	const screenX = applyDefault(specs.screenX, 0);
	const screenY = applyDefault(specs.screenY, 0);
	const clientX = applyDefault(specs.clientX);
	const clientY = applyDefault(specs.clientY, 0);
	const ctrlKey = toBool(specs.ctrlKey);
	const altKey = toBool(specs.altKey);
	const shiftKey = toBool(specs.shiftKey);
	const metaKey = toBool(specs.metaKey);
	const button = applyDefault(specs.button, 0);
	const relatedTarget = applyDefault(specs.relatedTarget, null);

	event.initMouseEvent(
		type,
		bubbles,
		cancelable,
		view,
		detail,
		screenX,
		screenY,
		clientX,
		clientY,
		ctrlKey,
		altKey,
		shiftKey,
		metaKey,
		button,
		relatedTarget
	);

	return event;
};

module.exports = _.isFunction(MouseEvent) ? makeNativeMouseEvent : makeFakeMouseEvent;
