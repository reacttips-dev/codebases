export const addHandler = (element, eventName, handler) => {
	element && element.addEventListener(eventName, handler);
};

export const removeHandler = (element, eventName, handler) => {
	element && element.removeEventListener(eventName, handler);
};