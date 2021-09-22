const _ = require('lodash');

const mailConnections = {
	instance: null,
	setMailConnection: (instance) => {
		_.assignIn(mailConnections, instance);
		// save instance
		mailConnections.instance = instance;
	}
};

module.exports = mailConnections;
