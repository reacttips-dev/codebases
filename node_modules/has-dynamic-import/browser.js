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

module.exports = function hasFunctionality() {
	if (!$then) {
		return {
			then: function (resolve) {
				resolve(false);
			}
		};
	}

	try {
		var promise = Function('return import("data:text/javascript,")')(); // eslint-disable-line no-new-func

		return $then(promise, thunkTrue, thunkFalse);
	} catch (e) {
		return pFalse;
	}
};
