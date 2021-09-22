// This code is written specifically this way to work on IE11
export function dispatchResizeEvent() {
	const event = document.createEvent('Event');
	event.initEvent('resize', false, true);
	window.dispatchEvent(event);
}
