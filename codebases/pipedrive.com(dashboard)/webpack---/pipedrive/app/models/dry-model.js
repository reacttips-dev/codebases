const { Model } = require('@pipedrive/webapp-core');
const _ = require('lodash');

module.exports = Model.extend({
	save: function(key, val, options) {
		let attrs = {};

		if (!key || _.isObject(key)) {
			attrs = key;
			options = val;
		} else {
			attrs[key] = val;
		}

		options = options || {};

		if (options.dryRun) {
			this.set(attrs, options);

			return this.executeCallbacks(options);
		} else {
			return Model.prototype.save.call(this, key, val, options);
		}
	},
	executeCallbacks: function(options) {
		if (_.isFunction(options.success)) {
			options.success(this, {}, options);
			this.trigger('sync', this, {}, options);
		}

		return null;
	}
});
