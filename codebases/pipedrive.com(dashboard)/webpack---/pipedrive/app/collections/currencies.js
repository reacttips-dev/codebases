const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Currency = require('models/currency');
/**
 * Currencies Collection
 */
const Currencies = Pipedrive.Collection.extend({
	model: Currency,
	waiting: true,

	url: function() {
		return `${app.config.api}/currencies`;
	},

	initialize: function(currencies) {
		if (_.isArray(currencies)) {
			this.add(currencies);
			this.onReady();
		}
	},

	onReady: function() {
		const self = this;

		this.waiting = false;

		_.forEach(this._callbacks, function(c) {
			c.callback.call(c.context, self);
		});

		//
		app.global.bind(
			'currency.model.*.add',
			function(model) {
				self.add(model);
			},
			this
		);

		app.global.bind(
			'currency.model.*.update',
			function(model) {
				const modelInCollection = this.where({ code: model.get('code') });

				if (modelInCollection.length) {
					modelInCollection[0].set(model.toJSON());
				}
			},
			this
		);
	},

	comparator: function(a, b) {
		const aIsCustom = a.get('is_custom_flag') === true;
		const bIsCustom = b.get('is_custom_flag') === true;

		if (aIsCustom && !bIsCustom) {
			return 1;
		}

		if (bIsCustom && !aIsCustom) {
			return -1;
		}

		if (a.get('name') > b.get('name')) {
			return 1;
		}

		if (b.get('name') > a.get('name')) {
			return -1;
		}

		return 0; // equal
	},

	parse: function(response) {
		return response.data;
	},

	ready: function(callback, context) {
		if (!this._callbacks) {
			this._callbacks = [];
		}

		if (this.waiting) {
			this._callbacks.push({ callback, context });
		} else {
			callback.call(context, this);
		}
	}
});

module.exports = new Currencies();
