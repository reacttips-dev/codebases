const _ = require('lodash');
const debounceWithCounter = (context, callback, wait, options) => {
	let count = 0;
	let collectedArgs = [];

	const debounced = _.debounce(
		() => {
			callback.apply(context, [count, ...collectedArgs]);
			count = 0;
			collectedArgs = [];
		},
		wait,
		options
	);

	return (...args) => {
		count++;
		collectedArgs.push([...args]);
		debounced();
	};
};

exports.debouncedTrigger = (context, event, wait = 300, options = { leading: true }) => {
	return debounceWithCounter(
		context,
		(count, ...args) => {
			context.trigger(event, count, ...args);
		},
		wait,
		options
	);
};
