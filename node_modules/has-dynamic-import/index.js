'use strict';

var callBound = require('call-bind/callBound');
var $then = callBound('Promise.prototype.then', true);

var pFalse = $then && Promise.resolve(false);
var thunkFalse = function () {
	return false;
};
var thunkTrue = function () {
	return true;
};

module.exports = function hasDynamicImport() {
	if (!$then) {
		return {
			then: function (resolve) {
				resolve(false);
			}
		};
	}

	try {
		var importWrapper = require('./import'); // eslint-disable-line global-require

		return $then(importWrapper(), thunkTrue, thunkFalse);
	} catch (e) {
		return pFalse;
	}
};
