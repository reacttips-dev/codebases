const template = require('../template');
const _ = require('lodash');
const inlineDate = require('./inline-date');
const datePicker = require('../date-picker');
const $ = require('jquery');

function isInlineDate(opts) {
	return opts && opts.inlineEditor && opts.field_type !== 'daterange';
}

function hasClearHandler(options) {
	return _.isObject(options.on) && _.isFunction(options.on.clear);
}

function isClearCommand(options) {
	return _.isBoolean(options.clear) && options.clear;
}

function bindDatePicker(options) {
	datePicker.render(options);

	if (isClearCommand(options)) {
		bindClearCommandEvent(options);
	}
}

function bindClearCommandEvent(options) {
	$(`#clear-${options.uuid}`).on('click', (ev) => {
		ev.stopPropagation();
		ev.preventDefault();
		$(`#${options.uuid}`).val('');

		if (hasClearHandler(options)) {
			options.on.clear();
		}

		datePicker.clear(options.uuid);
	});
}

module.exports = function(opts) {
	if (isInlineDate(opts)) {
		opts.field_type = 'inline-date';

		return inlineDate(opts);
	}

	// Bind primary date
	const options = _.assignIn({ uuid: `date-${_.makeid()}` }, opts);

	setTimeout(() => bindDatePicker(options), 10);

	// Bind secondary date (for date range)
	if (opts.subfields) {
		options.sub = _.assignIn(
			{
				uuid: `date-${_.makeid()}`
			},
			opts.subfields[0]
		);

		setTimeout(() => bindDatePicker(options.sub), 10);
	}

	options.field_type = 'date';
	options.autocompleteOff = true;
	delete options.subfields;
	delete options.options;

	return template({ input: options });
};
