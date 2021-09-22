'use strict';

const $ = require('jquery');
const _ = require('lodash');
const ServiceLoader = require('components/service-loader/index');
const React = require('react');
const ReactDOM = require('react-dom');
const User = require('models/user');
const {
	trackActivityTypeFilterToggled,
	trackToggleAllActivityTypeFilters
} = require('utils/analytics/activity-analytics');

function getExcludedTypes() {
	const userSettingValue = User.settings.get('activity_quickfilter_excluded_types');

	return userSettingValue ? userSettingValue.split(',') : [];
}

module.exports = ServiceLoader.extend({
	component: 'filter-components:activity-filters',
	serviceName: 'Activity type filter',
	template: _.template('<div></div>'),

	initialize: function(options) {
		this.onChange = options.onChange;
		this.disabled = options.disabled;
		ServiceLoader.prototype.initialize.apply(this, arguments); // eslint-disable-line
	},

	getActivityTypes: function() {
		const activityTypes = User.getActivityTypes();
		const excludedTypes = getExcludedTypes();

		return activityTypes.map((activityType) => {
			return {
				excluded: excludedTypes.indexOf(activityType.key_string) !== -1,
				icon_key: activityType.icon_key,
				key_string: activityType.key_string,
				name: activityType.name,
				active_flag: activityType.active_flag
			};
		});
	},

	getExcludedActivityTypes: function(filterKey) {
		const excludedTypes = getExcludedTypes();
		const position = excludedTypes.indexOf(filterKey);

		if (position === -1) {
			excludedTypes.push(filterKey);
		} else {
			excludedTypes.splice(position, 1);
		}

		return excludedTypes;
	},

	renderPage: function(ActivityTypeFilter) {
		this.activityTypeFilter = ActivityTypeFilter;
		this.renderActivityTypeFilter();
	},

	renderActivityTypeFilter: function() {
		if (!this.activityTypeFilter) {
			return;
		}

		ReactDOM.render(
			React.createElement(
				this.activityTypeFilter,
				{
					activityTypes: this.getActivityTypes(),
					toggleAllTypes: _.bind(this.toggleAllTypes, this),
					toggleActivityType: _.bind(this.toggleActivityType, this),
					toggleObjectType: function() {},
					nonAvailableRightWidth: $(window).width() - this.$el.width(),
					disabled: this.disabled
				},
				null
			),
			this.$el.get(0)
		);
	},

	toggleAllTypes: function(isSelected) {
		const activityTypes = _.map(User.getActivityTypes(), 'key_string');

		let includedTypes = [];
		let excludedTypes = [];

		if (isSelected) {
			excludedTypes = activityTypes;
		} else {
			includedTypes = activityTypes;
		}

		this.onChange(includedTypes, excludedTypes);
		this.renderActivityTypeFilter();
		trackToggleAllActivityTypeFilters(isSelected);
	},

	toggleActivityType: function(keyString) {
		const deactivatedTypes = User.getDeactivatedActivityTypeNames();
		const excludedTypes = _.difference(
			this.getExcludedActivityTypes(keyString),
			deactivatedTypes
		);
		const activityTypes = _.map(User.getActivityTypes(), 'key_string');
		const includedTypes = _.difference(activityTypes, _.union(excludedTypes, deactivatedTypes));

		this.onChange(includedTypes, excludedTypes);
		this.renderActivityTypeFilter();
		trackActivityTypeFilterToggled(excludedTypes, keyString);
	},

	onUnload: function() {
		ReactDOM.unmountComponentAtNode(this.$el.get(0));
	}
});
