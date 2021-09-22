const _ = require('lodash');

const languages = {
	setLanguages: (instance) => {
		_.assignIn(languages, instance);
	}
};

module.exports = languages;
