'use strict';

module.exports = function () {
	const promise = import('data:text/javascript,');
	promise.catch(() => {});
	return promise;
};
