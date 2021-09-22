const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const template = require('../template');
const moment = require('moment');
const datePicker = require('../date-picker');

module.exports = function(opts) {
	const options = _.assignIn(
		{
			uuid: `inline-date-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`
		},
		opts
	);
	const format = moment()
		.localeData()
		.longDateFormat('L');
	const value = _.isEmpty(options.value) ? moment() : moment(options.value, format);

	createLoadCallback(options.loadCallback, function() {
		datePicker.render(
			_.assignIn(options, {
				config: {
					bound: false,
					format,
					setDefaultDate: true,
					defaultDate: value.toDate(),
					container: document.getElementById(`${options.uuid}-container`)
				}
			})
		);
	});

	return template({ input: options });
};
