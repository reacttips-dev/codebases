const _ = require('lodash');
const User = require('models/user');
const FilterModel = require('models/filter');
const GraphqlCollection = require('./graphql');
const { getFilters, availableTypes, parseToOldFilters } = require('client/graphql/queries/filters');

/**
 * Filters Pipedrive Collection
 */
module.exports = GraphqlCollection.extend({
	model: FilterModel,
	filterType: 'deal',
	availableTypes,
	graph: function() {
		return { query: getFilters, variables: { type: this.filterType.toUpperCase() } };
	},

	pendingCallbacks: [],
	_ready: false,

	comparator: function(filter) {
		return ((filter && filter.get('name')) || '').toLowerCase();
	},

	url: `${app.config.api}/filters`,

	initialize: function(options) {
		options = options || {};

		this.skipCustomFilters = options.skipCustomFilters;

		app.global.bind('filter.model.*.add', this.onFilterUpdate, this);
		app.global.bind('filter.model.*.update', this.onFilterUpdate, this);
		app.global.bind('filter.model.*.delete', this.onFilterDelete, this);
	},

	onFilterUpdate: function(filter) {
		// not my shared filter updated to private - act as it was deleted
		if (filter.get('visible_to') === '1' && filter.get('user_id') !== User.get('id')) {
			this.onFilterDelete(filter);
		} else {
			const existingFilter = this.get(filter.get('id'));
			const newFilterHasCustomView = filter && filter.hasCustomView();

			if (existingFilter && existingFilter.hasCustomView()) {
				filter.set('custom_view_id', existingFilter.get('custom_view_id'), {
					silent: true
				});
			} else if (!newFilterHasCustomView) {
				filter.set('custom_view_id', null, { silent: true });
			}

			this.set(filter, { remove: false });
			this.sort();
		}
	},

	onFilterDelete: function(filter) {
		this.remove(filter);
	},

	parse: function(response) {
		const filters = _.get(response, 'data.filters');

		return parseToOldFilters(filters);
	},

	setType: function(filterType) {
		if (this.availableTypes.hasOwnProperty(filterType) && this.filterType !== filterType) {
			this.filterType = filterType;
			this.changed = true;
		}

		return this;
	},

	canEdit: function(filterId) {
		const filter = this.get(filterId);

		return (
			User.settings.get('can_edit_shared_filters') ||
			(filter && filter.get('user_id') === User.get('id'))
		);
	},

	getType: function(type) {
		type = type || this.filterType;

		return this.skipCustomFilters ? null : this.availableTypes[type];
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
					type: this.getType(),
					sort_by: 'name'
				},
				success: (m) => {
					this.fetching = false;
					this._ready = true;
					this.changed = false;

					if (!this.pendingCallbacks.length) {
						return;
					}

					for (let i = 0; i < this.pendingCallbacks.length; i++) {
						this.pendingCallbacks[i].callback(m);
					}
					this.pendingCallbacks = [];
				},
				error: (...args) => {
					this.fetching = false;
					this._ready = true;

					if (!this.pendingCallbacks.length) {
						return;
					}

					for (let i = 0; i < this.pendingCallbacks.length; i++) {
						if (_.isFunction(this.pendingCallbacks[i].errorCallback)) {
							this.pendingCallbacks[i].errorCallback(...args);
						}
					}
					this.pendingCallbacks = [];
				}
			});
		}
	},

	getCurrentTypeFilters: function() {
		const collectionType = this.getType();

		return _.filter(this.models, (filter) => filter.get('type') === collectionType);
	}
});
