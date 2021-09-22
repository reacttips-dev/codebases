const switchField = require('./switch');

module.exports = function(opts) {
	opts.style = 'switch-buttons';
	for (let i = 0; i < opts.options.length; i++) {
		let str = opts.options[i].label;

		str = str.charAt(0).toUpperCase() + str.slice(1);
		opts.options[i].label = str;
	}

	return switchField(opts);
};
