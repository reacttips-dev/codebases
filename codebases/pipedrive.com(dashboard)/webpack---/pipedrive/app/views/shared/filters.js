const _ = require('lodash');
const Pipedrive = require('pipedrive');
const User = require('models/user');
const Company = require('collections/company');
const teams = require('collections/teams');
const FiltersMenu = require('views/filters-menu/index');
const filterUtils = require('utils/filter-utils');
const modals = require('utils/modals');

let locals;

module.exports = Pipedrive.View.extend({
	options: null,
	ready: null,
	feature: null,
	featureName: '',
	featureView: null,
	filterType: null,
	defaultFilter: null,
	previousFilter: null,
	collection: null,
	teams: null,
	template: _.template('<div class="changeFilter"></div>'),
	defaultConf: {
		defaultFilter: { type: null },
		filterType: '',
		getFilterUrl: _.noop,
		onFilterChange: _.noop
	},

	initialize: function(config) {
		this.options = _.assignIn({}, this.defaultConf, config);

		if (User.companyFeatures.get('teams')) {
			this.teams = teams;
		}

		this.defaultFilter = this.options.defaultFilter;
		this.customView = this.options.customView;
		this.getFilterUrl = this.options.getFilterUrl;
		this.onFilterChange = this.options.onFilterChange;
		this.featureName = this.options.featureName;
		this.featureView = this.options.featureView;
		this.filterType = this.options.filterType || 'deal';

		this.ready = Pipedrive.Ready(['company', 'filters'], this.onReady.bind(this));

		Company.ready(() => {
			this.ready.set('company');
		});

		this.collection.ready(() => {
			this.ready.set('filters');
		});

		this.bindEvents();
	},

	bindEvents: function() {
		this.collection.on(
			'change',
			function(model) {
				if (model.id === parseInt(this.defaultFilter.value, 10)) {
					this.updateActiveItem(this.defaultFilter);
				}
			},
			this
		);

		User.settings.on('contactsTimelineService.filter.changed', (type, filter) => {
			if (this.filterType !== type) {
				return;
			}

			this.updateSelectedFilter(_.pick(filter, ['type', 'value']));
		});
	},

	createFiltersMenu: function() {
		this.filtersMenu = new FiltersMenu({
			collection: this.collection,
			teams: this.teams,
			viewType: this.collection.filterType,
			selectedFilter: this.defaultFilter,
			onEdit: this.onFilterEdit.bind(this),
			onAdd: this.onFilterAdd.bind(this),
			onSelect: this.onFilterSelect.bind(this)
		});
		this.addView('.changeFilter', this.filtersMenu);
	},

	loadFilterFromUrl: function() {
		const filterFromUrl = filterUtils.fromUrl();

		if (!filterFromUrl) {
			return;
		}

		const validUserFilter = locals.canAccessUserFilter(filterFromUrl);
		const validFilter = locals.canAccessFilter(filterFromUrl, this.collection);
		const validTeamFilter = locals.canAccessTeamFilter(filterFromUrl, this.teams);

		if (validUserFilter || validFilter || validTeamFilter) {
			this.defaultFilter = filterFromUrl;
		}
	},

	onReady: function() {
		this.loadFilterFromUrl();
		this.updateActiveItem(this.defaultFilter);
		this.createFiltersMenu();
	},

	selfRender: function() {
		this.$el.html(this.template());
	},

	onFilterAdd: function() {
		this.previousFilter = this.filter;

		this.showAction({ action: 'add' });
	},

	onFilterEdit: function(filterId, filterType) {
		this.previousFilter = this.filter;

		const filter = {
			action: 'edit',
			type: filterType,
			value: filterId,
			noFeatureViewUpdate: true
		};

		this.showAction(filter);
	},

	onFilterSelect: function(filterId, filterType) {
		const options = {
			type: filterType,
			value: filterId
		};

		if (
			this.filter &&
			_.isEqual(filterId, this.filter.value) &&
			_.isEqual(filterType, this.filter.type)
		) {
			return;
		}

		this.previousFilter = this.filter;
		this.onFilterUpdate(options);

		app.global.fire('track.filter.modal.select', options);
	},

	isValidFilter: function(filter) {
		if (_.isFinite(filter.value) && _.isObject(filter.attributes)) {
			return true;
		}

		return filter.value === 'everyone';
	},

	userHasTeams: function() {
		return this.teams && this.teams.length;
	},

	convertFilter: function(filter) {
		let result = null;

		if (filter.type === 'user') {
			result = Company.where({ id: Number(filter.value) })[0];

			if (_.isObject(result)) {
				result.type = 'user';
			}
		} else if (filter.type === 'filter') {
			result = this.collection.where({ id: Number(filter.value) })[0];

			if (_.isObject(result)) {
				result.type = 'filter';
			}
		} else if (filter.type === 'team' && this.userHasTeams()) {
			result = this.teams.find((team) => {
				return team.id === Number(filter.value);
			});

			if (_.isObject(result)) {
				result.type = 'team';
			}
		}

		return result;
	},

	getActiveFilter: function(filter) {
		if (!filter) {
			return null;
		}

		if (this.isValidFilter(filter)) {
			return filter;
		}

		if (filter.type === 'all_users') {
			this.filter = {
				type: 'user',
				value: 'everyone'
			};

			return this.getActiveFilter(this.filter);
		}

		if (filter.isTemp) {
			return filter;
		}

		return this.convertFilter(filter);
	},

	updateActiveItem: function(filter) {
		const activeFilter = this.getActiveFilter(filter);

		if (!_.isObject(filter) || !_.isObject(activeFilter)) {
			filter = {
				type: 'user',
				value: User.id
			};
		}

		if (_.isEqual(this.filter, filter)) {
			return;
		}

		this.filter = _.omit(filter, 'updated');

		if (!this.ready.isReady()) {
			return;
		}

		this.onFilterChange(filter);
		this.defaultFilter = filter.type === 'all_users' ? activeFilter : this.filter;

		User.settings.trigger('listView.filter.changed', this.filterType, filter);
	},

	/* eslint-disable complexity */
	showAction: function(opts) {
		const self = this;
		const model = self.collection.find({ id: parseInt(opts.value, 10) });
		const existingFilterChanged =
			_.isObject(this.filter) &&
			this.filter.type === opts.type &&
			this.filter.value !== opts.value;

		switch (opts.action) {
			case 'add':
				modals.open('webapp:modal', {
					modal: 'filter/add',
					params: {
						customView: self.customView,
						filtersCollection: self.collection,
						filterType: self.filterType,
						onFilterUpdate: self.onFilterUpdate.bind(self),
						onFilterReset: self.onFilterReset.bind(self),
						onFilterRemoved: self.onFilterRemoved.bind(self)
					},
					onAfterClose: false
				});

				break;
			case 'edit':
				if (opts.type !== 'filter') {
					return;
				}

				if (opts.value && existingFilterChanged && !opts.noFeatureViewUpdate) {
					const filter = {
						type: opts.type,
						value: opts.value
					};

					self.onFilterChange(filter);
				}

				modals.open('webapp:modal', {
					modal: 'filter/add',
					params: {
						customView: self.customView,
						filtersCollection: self.collection,
						filterType: self.filterType,
						filterModel: model,
						onFilterUpdate: self.onFilterUpdate.bind(self),
						onFilterReset: self.onFilterReset.bind(self),
						onFilterRemoved: self.onFilterRemoved.bind(self)
					},
					onAfterClose: false
				});

				break;
		}
	},
	/* eslint-enable complexity */

	updateSelectedFilter: function(filter) {
		this.updateActiveItem(filter);
		this.filtersMenu.updateActiveFilter(this.filter);
	},

	onFilterUpdate: function(filter, isPreview) {
		if (!filter) {
			filter = this.previousFilter;
		}

		this.updateActiveItem(filter);

		if (!isPreview) {
			filter = filter || this.previousFilter || this.filter;
			app.router.go(null, this.getFilterUrl(filter.type, filter.value), null, true);
			this.filtersMenu.updateActiveFilter(filter);
		}
	},
	onFilterReset: function() {
		this.onFilterUpdate(this.previousFilter);
	},
	onFilterRemoved: function(removedFilter, newFilter) {
		if (removedFilter.value === this.previousFilter.value) {
			this.onFilterUpdate(newFilter);
		} else {
			this.onFilterUpdate(this.previousFilter);
		}
	},

	onUnload: function() {
		this.$el.empty();
	}
});

locals = {
	canAccessUserFilter: function(filter) {
		if (filter.type !== 'user') {
			return false;
		}

		const userId = parseInt(filter.value, 10);

		if (!_.isFinite(userId)) {
			return true;
		}

		return !!Company.get(userId);
	},
	canAccessFilter: function(filter, collection) {
		if (filter.type !== 'filter') {
			return false;
		}

		const filterId = parseInt(filter.value, 10);

		if (!_.isFinite(filterId)) {
			return false;
		}

		return !!collection.get(filterId);
	},
	canAccessTeamFilter: function(filter, collection) {
		if (!User.companyFeatures.get('teams') || filter.type !== 'team' || !collection.length) {
			return false;
		}

		const teamId = parseInt(filter.value, 10);

		if (!_.isFinite(teamId)) {
			return false;
		}

		const existingTeam = _.find(collection.models, { id: teamId });

		return !!existingTeam;
	}
};
