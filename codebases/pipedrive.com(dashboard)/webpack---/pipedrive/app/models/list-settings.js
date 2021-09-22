'use strict';

const Pipedrive = require('pipedrive');
const User = require('models/user');
const Company = require('collections/company');
const FiltersCollection = require('collections/filters');
const filterUtils = require('utils/filter-utils');
const Summary = require('models/summary');
const _ = require('lodash');

const parametersBuilder = {
	buildCustomQueryParams: function() {
		if (_.isFunction(this.customFilterParams)) {
			return this.customFilterParams();
		}

		if (_.isObject(this.customFilterParams)) {
			return this.customFilterParams;
		}

		return {};
	},
	buildFields: function() {
		if (!this.customView) {
			return [];
		}

		return this.customView.getDataColumns();
	},
	buildSortParams: function() {
		if (!this.customView) {
			return {};
		}

		return {
			sort: this.customView.getColumnsSortOrder()
		};
	},
	buildFirstLetterParams: function() {
		if (!parametersBuilder.isFirstLetterEnabled.call(this)) {
			return {};
		}

		return {
			first_char: this.firstLetter === 'all' ? '' : this.firstLetter.charAt(0)
		};
	},
	isFirstLetterEnabled: function() {
		return !_.isNull(this.firstLetter) && !_.isUndefined(this.firstLetter);
	},
	buildSummaryParams: function() {
		if (_.isObject(this.summaryParams)) {
			return this.summaryParams;
		}

		return {};
	},

	buildFilterByLabelParams: function() {
		return { label: this.labelId || null };
	}
};

const locals = {
	addOnSyncEvent: function(eventName) {
		this.beforeSyncEventsSet.push(`before:${eventName}`);
		this.beforeSyncEventsSet = _.uniq(this.beforeSyncEventsSet);

		this.afterSyncEventsSet.push(eventName);
		this.afterSyncEventsSet = _.uniq(this.afterSyncEventsSet);
	},
	generateAndFlushEvents: function() {
		while (this.afterSyncEventsSet.length) {
			_.defer(_.bind(this.trigger, this, this.afterSyncEventsSet.shift()));
		}
	},
	generateBeforeEvents: function() {
		while (this.beforeSyncEventsSet.length) {
			this.trigger(this.beforeSyncEventsSet.shift());
		}
	},
	isValidFilter: function(filter) {
		let isValid = filterUtils.isValid(filter);

		if (isValid && !filter.isTemp) {
			switch (filter.type) {
				case 'filter':
					isValid = _.isObject(this.filtersCollection.get(parseInt(filter.value, 10)));
					break;
				case 'user':
					isValid =
						filter.value === 'everyone' ||
						_.isObject(Company.get(parseInt(filter.value, 10)));
					break;
				case 'team':
					isValid;
					break;
				default:
					isValid = false;
			}
		}

		return isValid;
	},
	getValidFilter: function(filter) {
		let isValid = locals.isValidFilter.call(this, filter);

		if (!isValid) {
			filter = filterUtils.parse(User.settings.get(this.filterSettingsName));
			isValid = locals.isValidFilter.call(this, filter);

			if (!isValid) {
				filter = {
					type: 'user',
					value: User.id
				};
			}
		}

		return filter;
	},
	getFilterCustomView: function(callback) {
		const useDefaultCustomView = _.partial(
			_.defer,
			_.bind(function() {
				callback(locals.getUserDefaultCustomView.call(this));
			}, this)
		);

		if (this.filter.type !== 'filter') {
			return useDefaultCustomView();
		}

		const filterModel = this.filtersCollection.get(this.filter.value);

		locals.loadCustomViewForFilter(filterModel, useDefaultCustomView, callback);
	},

	loadCustomViewForFilter: function(filterModel, applyDefault, callback) {
		if (!_.isObject(filterModel) || !filterModel.hasCustomView()) {
			return applyDefault();
		}

		filterModel.getAssignedCustomView((filterCustomView) => {
			if (!filterCustomView) {
				return applyDefault();
			}

			callback(filterCustomView);
		});
	},
	getUserDefaultCustomView: function() {
		return User.customViews.getView(this.collection.type, this.subViewKey);
	},
	buildPullOptions: function(queryParams, fields) {
		const pullOptions = {
			data: queryParams,
			reset: true,
			success: _.bind(locals.generateAndFlushEvents, this),
			error: _.bind(locals.generateAndFlushEvents, this)
		};

		if (!_.isEmpty(fields)) {
			pullOptions.fields = fields;
		}

		return pullOptions;
	},
	buildListPullOptions: function() {
		const fields = parametersBuilder.buildFields.call(this);
		const queryParams = _.assignIn(
			{},
			filterUtils.toQueryParams(this.filter),
			parametersBuilder.buildSortParams.call(this),
			parametersBuilder.buildFirstLetterParams.call(this),
			parametersBuilder.buildCustomQueryParams.call(this),
			parametersBuilder.buildFilterByLabelParams.call(this),
			{ start: 0 }
		);

		return locals.buildPullOptions.call(this, queryParams, fields);
	},
	buildSummaryPullOptions: function() {
		const queryParams = _.assignIn(
			{},
			filterUtils.toQueryParams(this.filter),
			parametersBuilder.buildFirstLetterParams.call(this),
			parametersBuilder.buildSummaryParams.call(this),
			parametersBuilder.buildCustomQueryParams.call(this),
			parametersBuilder.buildFilterByLabelParams.call(this)
		);

		return locals.buildPullOptions.call(this, queryParams);
	},
	customViewChanged: function(noRepull, changedView) {
		if (changedView && changedView.get('active_flag') === false) {
			return this.stopListenToCustomViewChanges();
		}

		this.resetFirstLetter();
		locals.addOnSyncEvent.call(this, 'changed:custom-view');

		if (!noRepull) {
			this.pullCollection();
		}
	},
	tempFilterChanged: function() {
		locals.addOnSyncEvent.call(this, 'changed:filter');
		this.pullCollection();
	},
	filterChanged: function() {
		let customView;

		const filter = this.getFilterModel();
		const ready = Pipedrive.Ready(
			['customview', 'filter'],
			_.bind(function() {
				this.setCustomView(customView, true);
				this.resetFirstLetter();
				locals.addOnSyncEvent.call(this, 'changed:filter');
				this.pullCollection();
			}, this)
		);

		locals.getFilterCustomView.call(this, (customViewModel) => {
			customView = customViewModel;
			ready.set('customview');
		});

		if (!filter || filter.get('conditions')) {
			ready.set('filter');
		} else {
			filter.pull({
				success: function() {
					ready.set('filter');
				}
			});
		}
	},
	firstLetterChanged: function() {
		locals.addOnSyncEvent.call(this, 'changed:first-letter');
		this.pullCollection();
	},
	cancelPreviousRequests: function() {
		if (this.collection.pulling()) {
			this.collection.lastFetchRequest.abort();
		}

		if (this.summaryModel.pulling()) {
			this.summaryModel.lastFetchRequest.abort();
		}
	}
};

const listSettings = function(options) {
	options = options || {};

	this.afterSyncEventsSet = [];
	this.beforeSyncEventsSet = [];
	this.addButtonId = options.addButtonId;
	this.customView = options.customView;
	this.subViewKey = options.subViewKey;
	this.collection = options.collection;
	this.filter = options.filter;
	this.filterSettingsName = options.filterSettingsName;
	this.firstLetter = options.firstLetter;
	this.customFilterParams = options.customFilterParams;
	this.summaryParams = options.summaryParams;
	this.columnPickerAvailableTypes = options.columnPickerAvailableTypes;
	this.useIconsForTypes = options.useIconsForTypes;
	this.filtersCollection = new FiltersCollection();
	this.filtersCollection.setType(this.collection.type);
	this.customViewChangedHandler = _.partial(locals.customViewChanged, false);
	this.summaryModel = new Summary({
		type: this.collection.type
	});

	this.listenToChanges();
};

_.assignIn(
	listSettings.prototype,
	{
		loadFiltersCollection: function(callback) {
			this.filtersCollection.ready(_.ary(callback, 0));
		},
		listenToChanges: function() {
			this.listenToCustomViewChanges();
			this.collection.on('sync reset error', locals.generateAndFlushEvents, this);
			this.collection.on(
				'update:alphabet',
				_.bind(function(model) {
					this.summaryModel.trigger('update:alphabet', model);
				}, this)
			);
		},
		listenToCustomViewChanges: function() {
			if (this.customView) {
				this.customView.on('change', this.customViewChangedHandler, this);
			}
		},
		stopListenToCustomViewChanges: function() {
			if (this.customView) {
				this.customView.off('change', this.customViewChangedHandler, this);
			}
		},
		setCustomView: function(customView, noRepull) {
			if (!!this.customView && _.isEqual(customView.toJSON(), this.customView.toJSON())) {
				return;
			}

			this.stopListenToCustomViewChanges();
			this.customView = customView;
			this.listenToCustomViewChanges();
			locals.customViewChanged.call(this, noRepull);
		},
		getCustomView: function() {
			return this.customView;
		},
		getColumnPickerAvailableTypes: function() {
			return this.columnPickerAvailableTypes;
		},
		getUseIconsForTypes: function() {
			return this.useIconsForTypes;
		},
		getFilter: function() {
			if (!this.filter) {
				return locals.getValidFilter.call(this);
			}

			return this.filter;
		},
		getFilterModel: function() {
			const currentFilter = this.getFilter();

			if ('filter' !== currentFilter.type) {
				return null;
			}

			return this.filtersCollection.get(currentFilter.value);
		},
		setFilter: function(filter) {
			const processedFilter = locals.getValidFilter.call(this, filter);

			if (filterUtils.areEqual(processedFilter, this.filter)) {
				return;
			}

			this.filter = _.cloneDeep(_.omit(processedFilter, 'isEdit', 'updated'));

			if (this.filter.isTemp) {
				locals.tempFilterChanged.call(this);
			} else {
				locals.filterChanged.call(this);
			}
		},
		hasFilterSelected: function() {
			return this.filter && this.filter.value !== 'everyone';
		},
		getFirstLetter: function() {
			return this.firstLetter && this.firstLetter !== 'all' ? this.firstLetter : null;
		},
		setFirstLetter: function(firstLetter) {
			if (_.isEqual(firstLetter, this.firstLetter)) {
				return;
			}

			this.firstLetter = firstLetter;
			locals.firstLetterChanged.call(this);
		},
		resetFirstLetter: function() {
			if (!parametersBuilder.isFirstLetterEnabled.call(this)) {
				return;
			}

			this.firstLetter = 'all';
			locals.addOnSyncEvent.call(this, 'reset:first-letter');
		},

		filterByLabel: function(labelId) {
			this.labelId = labelId;
			this.pullCollection();
		},

		customFilterParamsChanged: function() {
			locals.addOnSyncEvent.call(this, 'changed:custom-filter');
			this.pullCollection();
		},
		pullCollection: function() {
			locals.generateBeforeEvents.call(this);
			locals.cancelPreviousRequests.call(this);
			this.collection.pull(locals.buildListPullOptions.call(this));

			if (this.summaryModel.get('type')) {
				this.summaryModel.pull(locals.buildSummaryPullOptions.call(this));
			}
		},
		getSummary: function() {
			return this.summaryModel;
		},
		syncSummary: function() {
			this.summaryModel.pull(locals.buildSummaryPullOptions.call(this));
		}
	},
	Pipedrive.Events
);

module.exports = listSettings;
