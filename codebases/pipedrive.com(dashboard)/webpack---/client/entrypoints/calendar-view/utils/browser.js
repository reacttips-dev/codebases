export const pointerEventsSupported = () => 'undefined' !== typeof window.PointerEvent;

export const supportedPointerEvents = () => {
	const eventPrefix = pointerEventsSupported() ? 'pointer' : 'mouse';

	return {
		pointerDown: `${eventPrefix}down`,
		pointerUp: `${eventPrefix}up`,
		pointerMove: `${eventPrefix}move`,
	};
};
