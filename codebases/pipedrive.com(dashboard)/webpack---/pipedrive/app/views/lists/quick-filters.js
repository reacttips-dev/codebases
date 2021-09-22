'use strict';

const _ = require('lodash');
const $ = require('jquery');
const Pipedrive = require('pipedrive');
const Timeparsers = require('utils/timeparsers');
const template = require('templates/lists/quick-filters.html');
const moment = require('moment');
const componentLoader = require('webapp-component-loader');

let locals;

const QuickFiltersView = Pipedrive.View.extend({
	template: _.template(template),

	initialize: function(options) {
		this.options = options || {};
		this.filters = options.filters;
		this.key = options.key;
		this.customDates = options.customDates || {};

		this.activeFilter = _.find(this.filters, { checked: true }).key_string;

		this.render();
		this.bindEvents();
	},

	selfRender: function() {
		this.$el.html(
			this.template({
				filters: this.filters,
				key: this.key,
				activeFilter: this.activeFilter
			})
		);
	},

	bindEvents: function() {
		const self = this;

		this.$('.quick-filters-btn')
			.off('click')
			.on('click', _.partial(locals.quickFilterChanged, self));

		this.$('.customTimeRange')
			.off('click')
			.on('click', _.partial(locals.customTimeRangeClicked, self));
	},

	disable: function() {
		this.$('.quick-filters-btn').attr('disabled', true);
		this.$('.customTimeRange').attr('disabled', true);

		this.$el.find('select').select2('disable');
	},

	enable: function() {
		const filter = this.$el.find('.inlineFilters');

		this.$('.quick-filters-btn').removeAttr('disabled');
		this.$('.customTimeRange').removeAttr('disabled');

		this.$el.find('select').select2('enable');

		filter.disableTooltip();

		this.bindEvents();
	},

	handleFilterChange: function(target, opts) {
		this.customDates = opts;

		this.activeFilter = $(target).data('value');

		this.selfRender();
		this.bindEvents();

		this.setCustomTimeRangeLabelText(opts);
	},

	setCustomTimeRangeLabelText: function(opts) {
		const el = this.$('.customTimeRange > span');

		let text;

		if (_.isUndefined(opts) || _.isEmpty(opts.dateFrom)) {
			text = _.gettext('Select period');
		} else {
			text = Timeparsers.compactDateRange(
				moment(opts.dateFrom, 'L'),
				moment(opts.dateTo, 'L')
			);
		}

		el.text(text);
	}
});

locals = {
	quickFilterChanged: function quickFilterChanged(view, e) {
		const selectedFilter = $(e.currentTarget).data('value');

		if (view.activeFilter === selectedFilter) {
			return;
		}

		view.handleFilterChange(e.currentTarget, view.customDates);

		if (view.options.onChange) {
			view.options.onChange(view.activeFilter);
		}
	},

	customTimeRangeClicked: async function customTimeRangeClicked(view, e) {
		const target = e.currentTarget;

		if ($(target).hasClass('disabled')) {
			return;
		}

		e.preventDefault();

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'activity/status-time-range',
			params: {
				target,
				position: 'bottom-end',
				values: view.customDates,
				onApply: function(opts) {
					if (
						moment(opts.dateFrom, 'L').isValid() &&
						moment(opts.dateTo, 'L').isValid()
					) {
						view.handleFilterChange(target, opts);

						if (view.options.onChange) {
							view.options.onChange('customTimeRange', opts);
						}
					}
				}
			}
		});
	}
};

module.exports = QuickFiltersView;
