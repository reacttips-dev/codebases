const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const template = require('../template');

module.exports = function(opts) {
	const options = _.assignIn(opts, {
		uuid: `set-${_.makeid()}`,
		field_type: 'set',
		form_type: 'radio',
		loadCallback: `async_${_.makeid()}`
	});

	createLoadCallback(options.loadCallback);

	return template({ input: options });
};
