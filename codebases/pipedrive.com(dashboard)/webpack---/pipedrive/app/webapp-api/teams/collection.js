const { Collection } = require('@pipedrive/webapp-core');

function handlePendingCallbacks(pendingCallbacks, response) {
	if (pendingCallbacks.length) {
		pendingCallbacks.forEach(function(item, index) {
			pendingCallbacks[index].callback(response);
		});

		pendingCallbacks = [];
	}
}

module.exports = Collection.extend({
	pendingCallbacks: [],
	_ready: false,

	url: function() {
		return `${app.config.api}/teams/`;
	},

	ready: function(callback, errorCallback) {
		if (this.fetching) {
			this.pendingCallbacks.push({ callback, error: errorCallback });
		} else if (this._ready && !this.changed) {
			return callback(this);
		} else {
			this.fetching = true;
			this.pendingCallbacks.push({ callback, error: errorCallback });

			this.pull({
				data: {
					order_by: 'name'
				},
				success: (response) => {
					this.fetching = false;
					this._ready = true;
					this.changed = false;

					handlePendingCallbacks(this.pendingCallbacks, response);
				},
				error: (collection, response) => {
					this.fetching = false;
					this._ready = true;

					handlePendingCallbacks(this.pendingCallbacks, response);
				}
			});
		}
	},

	getById: function(id) {
		return this.find({ id: parseInt(id, 10) });
	}
});
