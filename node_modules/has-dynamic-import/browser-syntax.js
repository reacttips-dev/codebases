'use strict';

module.exports = function hasSyntax() {
	try {
		Function('import("").catch(() => {})'); // eslint-disable-line no-new-func

		return true;
	} catch (e) {
		return false;
	}
};
