const template = require('../template');
const _ = require('lodash');

module.exports = function(opts) {
	const placeholder = opts.placeholder || '';
	const options = _.assignIn(opts, {
		field_type: 'numeric',
		uuid: `number-${_.makeid()}`,
		placeholder
	});

	return template({ input: options });
};
