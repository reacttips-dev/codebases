const _ = require('lodash');

const intercom = {
	setIntercom: (instance) => {
		_.assignIn(intercom, instance);
	}
};

module.exports = intercom;
