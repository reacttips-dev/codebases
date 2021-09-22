const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const template = require('../template');
const $ = require('jquery');

function getClassName(opts, options) {
	const className = ['cui4-button'];

	if (opts.class) {
		className.push(opts.class);
	}

	if (options.color) {
		className.push(`cui4-button--${options.color}`);
	}

	if (options.size) {
		if (options.size === 'small') {
			options.size = 's';
		}

		className.push(`cui4-button--${options.size}`);
	}

	if (options.active) {
		className.push('cui4-button--active');
	}

	return className;
}

module.exports = function(opts) {
	const options = _.assignIn(
		{
			text: '',
			uuid: `pipeButton-${_.makeid()}`,
			data: {
				test: `${opts.wrapClassName || opts.class || opts.title}-button`
			},
			field_type: 'button',
			// Added to button wrapper
			class: '',
			// Added to span inside button
			className: ''
		},
		opts
	);

	if (_.isFunction(options.action)) {
		options.loadCallback = `async_${_.makeid()}`;

		createLoadCallback(options.loadCallback, () => {
			$(document).on('click.widget', `#${options.uuid}`, options.action);
		});
	}

	options.reduceData = function data(data) {
		if (typeof data !== 'undefined') {
			return _.reduce(
				data,
				(result, value, key) => {
					result += `data-${key}="${_.escape(value)}" `;

					return result;
				},
				''
			);
		}

		return null;
	};

	const className = getClassName(opts, options);

	options.class = className.join(' ');

	return template({ input: options });
};
