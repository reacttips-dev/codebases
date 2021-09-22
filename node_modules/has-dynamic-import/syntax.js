'use strict';

module.exports = function hasSyntax() {
	try {
		require('./import'); // eslint-disable-line global-require

		return true;
	} catch (e) {
		return false;
	}
};

