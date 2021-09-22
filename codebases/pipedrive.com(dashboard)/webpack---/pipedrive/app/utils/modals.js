const _ = require('lodash');

const modals = {
	setModals: (instance) => {
		_.assignIn(modals, instance);
	}
};

module.exports = modals;
