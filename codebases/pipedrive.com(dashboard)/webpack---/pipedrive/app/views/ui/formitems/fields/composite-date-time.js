const dateField = require('./date');
const _ = require('lodash');
const timeField = require('./time');

module.exports = function(opts) {
	const timeOptions = _.assignIn(opts.sub, {
		field_type: 'time'
	});
	const dateOptions = _.assignIn(opts, {
		field_type: 'inline-date',
		/* eslint-disable no-undefined */
		sub: undefined,
		subfields: undefined,
		/* eslint-enable no-undefined */
		autocompleteOff: true
	});

	return `<div class="composite-date-time">${dateField(dateOptions)}${timeField(
		timeOptions
	)}</div>`;
};
