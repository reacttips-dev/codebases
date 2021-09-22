const { Model } = require('@pipedrive/webapp-core');
const _ = require('lodash');

// one jwt is valid for 1 minute

const JWT_TIMEOUT = 60000;
const Jwt = Model.extend({
	url: function() {
		return '/api/v1/authorizations/socket-token';
	},
	timestamp: null,

	set: function(attrs, options) {
		this.timestamp = Date.now();

		return Model.prototype.set.call(this, attrs, options);
	},

	invalidate: function() {
		this.set('jwt', null);
	},

	abortLast: function() {
		if (this.pulling()) {
			this.lastFetchRequest.abort();
		}
	},

	getValidJwt: function(callback, errorCallback) {
		const jwt = this.get('jwt');
		const timeout = Date.now() - this.timestamp > JWT_TIMEOUT;

		if (jwt && !timeout) {
			return callback(jwt);
		} else {
			this.getNew(callback, errorCallback);
		}
	},

	getNew: function(callback, errorCallback) {
		const self = this;

		this.pull({
			success: function() {
				if (_.isFunction(callback)) {
					return callback(self.get('jwt'));
				}
			},
			error: function() {
				if (_.isFunction(errorCallback)) {
					errorCallback();
				}
			}
		});
	}
});

module.exports = Jwt;
