'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const listSummaryTemplate = require('templates/shared/list-summary.html');
const componentLoader = require('webapp-component-loader');

module.exports = Pipedrive.View.extend({
	/**
	 * Summary view for lists
	 */
	tagName: 'span',
	template: _.template(listSummaryTemplate),
	events: {
		'click .listSummaryIcon': 'createSummaryPopover'
	},
	summaryCounters: {
		activity: [
			{
				key: 'overdue_count',
				text: _.gettext('overdue')
			},
			{
				key: 'today_count',
				text: _.gettext('today')
			},
			{
				key: 'upcoming_count',
				text: _.gettext('upcoming')
			},
			{
				key: 'done_count',
				text: _.gettext('done')
			}
		]
	},
	initialize: function(options) {
		this.options = options || {};
		this.type = options.type;
		this.model = options.listSettings
			? options.listSettings.getSummary()
			: options.summaryModel;
		this.model.on('sync', this.onSummaryPopulate, this);

		return this;
	},
	getTypeText: function() {
		const count = parseInt(this.summary.total, 10);

		if (this.type === 'deal') {
			return _.ngettext('%d deal', '%d deals', count, count);
		} else if (this.type === 'organization') {
			return _.ngettext('%d organization', '%d organizations', count, count);
		} else if (this.type === 'person') {
			return _.ngettext('%d person', '%d people', count, count);
		} else if (this.type === 'activity') {
			return _.ngettext('%d activity', '%d activities', count, count);
		} else if (this.type === 'product') {
			return _.ngettext('%d product', '%d products', count, count);
		}

		return '';
	},
	formatCounters: function(summary) {
		if (!this.summaryCounters[this.type] || !summary.counters) {
			return summary;
		}

		const counters = _.cloneDeep(this.summaryCounters[this.type]);

		const summaryList = _.cloneDeep(summary);

		_.forEach(counters, (counter) => {
			counter.count = summaryList.counters[counter.key];
		});

		summaryList.counters = _.filter(counters, (item) => {
			return item.count;
		});

		return summaryList;
	},
	isEmptySummary: function() {
		const self = this;

		return _.reduce(
			this.summaryList,
			(result, summaryDetail) => {
				return (
					(result && _.isEmpty(summaryDetail)) ||
					(!self.hasCurrencyList() && _.isEqual(self.type, 'deal'))
				);
			},
			true
		);
	},
	/**
	 * Shows summary list popover on click
	 * @void
	 */
	createSummaryPopover: async function() {
		if (this.isEmptySummary()) {
			return;
		}

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'summary',
			params: {
				position: 'bottom-end',
				target: this.$('.listSummaryIcon'),
				data: this.formatCounters(this.summaryList)
			}
		});
	},
	render: function() {
		if (_.isObject(this.summary) && this.summary.total > 0) {
			this.$el.html(
				this.template({
					summary: this.summary,
					summaryList: this.summaryList,
					typeText: this.getTypeText()
				})
			);
		} else {
			this.$el.empty();
		}

		this.focus();

		return this;
	},
	onSummaryPopulate: function() {
		this.formatSummary();
		this.render();
	},
	formatSummary: function() {
		this.summary = {
			total: this.model.get('total_count'),
			formatted: this.model.get('total_currency_converted_value_formatted'),
			weightedFormatted: this.model.get('total_weighted_currency_converted_value_formatted'),
			type: this.type,
			hasList: this.hasCurrencyList() || _.isObject(this.model.get('counters'))
		};

		this.summaryList = {
			total: _.sortBy(this.model.get('values_total'), 'value').reverse(),
			weighted: _.sortBy(this.model.get('weighted_values_total'), 'value').reverse(),
			counters: this.model.get('counters')
		};
	},
	getFormatted: function() {
		return this.summary;
	},
	hasCurrencyList: function() {
		return (
			_.isObject(this.model.get('values_total')) && _.size(this.model.get('values_total')) > 1
		);
	}
});
