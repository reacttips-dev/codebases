const _ = require('lodash');
const defaultOptions = {
	maxRetryCount: 2
};
const Retryable = function(options) {
	this.options = _.assignIn({}, defaultOptions, options);
	this.pullOptions = _.assignIn({}, this.options.pullOptions);
	this.inputSuccessCallback = this.pullOptions.success;
	this.inputErrorCallback = this.pullOptions.error;
};

_.assignIn(Retryable.prototype, {
	pull: function() {
		this.currentRetryCount = 0;
		this.retryRequest = null;

		this.pullOptions.success = this.onRetrySuccess.bind(this);
		this.pullOptions.error = this.onRetryError.bind(this);

		this.options.pullMethod(this.pullOptions);
	},

	onRetrySuccess: function() {
		if (_.isFunction(this.inputSuccessCallback)) {
			this.inputSuccessCallback();
		}
	},

	onRetryError: function(object, xhr, response) {
		let finishRetry = false;

		if (_.isFunction(this.options.onRetryError)) {
			finishRetry = this.options.onRetryError(object, xhr, response);
		}

		if (!finishRetry && this.currentRetryCount < this.options.maxRetryCount) {
			this.retryPull();
			this.currentRetryCount++;

			return;
		}

		this.finishRetry(object, xhr, response);
	},

	retryPull: function() {
		this.retryRequest = this.options.pullMethod(this.pullOptions);
	},

	isRetryPending: function() {
		return !!this.retryRequest && this.retryRequest.state() === 'pending';
	},

	abort: function() {
		if (this.isRetryPending()) {
			this.retryRequest.abort();
			this.finishRetry(null, null, 'Retry request cancelled');
		}
	},

	finishRetry: function(object, xhr, response) {
		if (_.isFunction(this.inputErrorCallback)) {
			this.inputErrorCallback(object, xhr, response);
		}
	}
});

module.exports = Retryable;
