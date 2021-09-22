'use strict';

const _ = require('lodash');
const ServiceLoader = require('components/service-loader/index');
const React = require('react');
const ReactDOM = require('react-dom');
const Company = require('collections/company');

module.exports = ServiceLoader.extend({
	component: 'filter-components:filters-menu',
	serviceName: 'Filters Menu',
	template: _.template('<div></div>'),

	initialize: function(options, ...rest) {
		this.collection = options.collection;
		this.teams = options.teams;
		this.viewType = options.viewType;
		this.activeFilter = this.getActiveFilter(options.selectedFilter);
		this.onAdd = options.onAdd;
		this.onEdit = options.onEdit;
		this.onSelect = options.onSelect;
		this.filters = this.getFilters();
		this.collection.on('add remove change', this.updateFiltersCollection.bind(this));

		ServiceLoader.prototype.initialize.apply(this, [options, ...rest]);
	},

	getFilters: function() {
		const filters = this.collection.getCurrentTypeFilters();

		return filters
			.filter((filter) => !filter.get('temporary_flag'))
			.map((filter) => ({
				value: filter.get('id'),
				name: filter.get('name'),
				visible_to: filter.get('visible_to'),
				user_id: filter.get('user_id'),
				type: 'filter'
			}));
	},

	getActiveFilter: function(filter) {
		if (filter.type === 'filter') {
			const filterValue = Number(filter.value);
			const filterModel = this.collection.find({ id: filterValue });

			if (filterModel) {
				return { name: filterModel.get('name'), value: filterValue, type: filter.type };
			}
		} else if (filter.type === 'team') {
			const teamFilterValue = Number(filter.value);
			const teamModel = this.teams.find({ id: teamFilterValue });

			if (teamModel) {
				return { name: teamModel.get('name'), value: teamFilterValue, type: filter.type };
			}
		} else {
			const user = Company.getUserById(filter.value);
			const userFilterName = user ? user.get('name') : _.gettext('Everyone');
			const userFilterValue = user ? Number(filter.value) : filter.value;

			return { name: userFilterName, value: userFilterValue, type: filter.type };
		}

		return filter;
	},

	renderPage: function(FiltersMenu) {
		this.filtersMenu = FiltersMenu;
		this.renderFiltersMenu();
	},

	renderFiltersMenu: function() {
		if (!this.filtersMenu) {
			return;
		}

		ReactDOM.render(
			React.createElement(
				this.filtersMenu,
				{
					activeFilter: this.activeFilter,
					filters: this.filters,
					excludeTeams: this.viewType === 'product' || this.viewType === 'activity',
					onAddNewFilter: _.bind(this.onAddNewFilter, this),
					onEditFilter: _.bind(this.onEditFilter, this),
					onSelectFilter: _.bind(this.onSelectFilter, this),
					type: this.viewType
				},
				null
			),
			this.$el.get(0)
		);
	},

	updateActiveFilter: function(activeFilter) {
		this.activeFilter = this.getActiveFilter(activeFilter);
		this.renderFiltersMenu();
	},

	updateFiltersCollection: function() {
		this.filters = this.getFilters();
	},

	onSelectFilter: function(filterType, filterItem) {
		this.onSelect(filterItem.value, filterType);
	},

	onEditFilter: function(filter) {
		this.onEdit && this.onEdit(filter.value, filter.type);
	},

	onAddNewFilter: function() {
		this.onAdd && this.onAdd();
	}
});
