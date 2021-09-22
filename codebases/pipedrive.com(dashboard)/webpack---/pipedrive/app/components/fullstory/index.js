const _ = require('lodash');

const fullstory = {
	setFullstory: (instance) => {
		_.assignIn(fullstory, instance);
	}
};

module.exports = fullstory;
