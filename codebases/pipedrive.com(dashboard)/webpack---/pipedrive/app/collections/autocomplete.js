const Pipedrive = require('pipedrive');
const _ = require('lodash');
const ResultModel = require('models/result');

module.exports = Pipedrive.Collection.extend({
	model: ResultModel,
	activeModel: null,
	url: function() {
		switch (this.type) {
			case 'person':
				return `${app.config.api}/persons/find`;
			case 'organization':
				return `${app.config.api}/organizations/find`;
			case 'product':
				return `${app.config.api}/products/find`;
			case 'deal':
				return `${app.config.api}/deals/find`;
			case 'custom':
				return '/v1/itemSearch/field/';
			default:
				return '/v1/itemSearch';
		}
	},

	initialize: function(opts) {
		this.on('activate:selection', this.activate, this);
		this.on('reset', this.update, this);
		this.opts = opts;
	},

	pull: function(options) {
		// eslint-disable-next-line no-unused-vars
		for (const attribute in options.data) {
			if (_.isFunction(options.data[attribute])) {
				options.data[attribute] = options.data[attribute]();
			}
		}

		this.query = options.data.term;

		return Pipedrive.Collection.prototype.pull.call(this, options);
	},

	parse: function(response) {
		this.additionalData = response.additional_data;
		this.updateRelatedObjects(response, this.opts);

		return response.data?.items || response.data || [];
	},

	setActive: function(model) {
		if (this.activeModel) {
			this.activeModel.active = false;
		}

		if (model) {
			model.active = true;
		}

		this.activeModel = model;
		this.trigger('selected', model);
	},

	getActive: function() {
		if (this.activeModel && this.activeModel.collection && this.activeModel.active) {
			return this.activeModel;
		}

		this.clearActive();
	},

	clearActive: function() {
		this.setActive(null);
	},

	next: function() {
		if (this.length === 0) {
			return;
		}

		let i = this.indexOf(this.getActive()) + 1;

		if (i >= this.length) {
			i = 0;
		}

		this.setActive(this.at(i));

		return this;
	},

	prev: function() {
		if (this.length === 0) {
			return;
		}

		let i = this.indexOf(this.getActive()) - 1;

		if (i < 0) {
			i = this.length - 1;
		}

		this.setActive(this.at(i));

		return this;
	},

	update: function(/* collection, response */) {
		if (this.length === 0) {
			this.activeModel = null;
		}
	},

	activate: function(ev) {
		if (!this.activeModel) {
			return false;
		}

		this.activeModel.trigger('activate', ev);
	}
});
