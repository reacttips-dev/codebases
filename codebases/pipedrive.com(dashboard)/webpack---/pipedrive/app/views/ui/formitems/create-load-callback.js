const $ = require('jquery');
const _ = require('lodash');

module.exports = function(uuid, callback) {
	window[uuid] = function() {
		if (_.isFunction(callback)) {
			// eslint-disable-next-line callback-return
			callback();
		}

		delete window[uuid];
		$(`#script_${uuid}`).remove();
	};
};
