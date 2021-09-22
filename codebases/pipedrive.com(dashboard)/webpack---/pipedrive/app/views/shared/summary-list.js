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
		'click .listSummary': 'createSummaryPopover'
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
		this.collection = options.summary;

		return this;
	},

	getTypeText: function() {
		const count = parseInt(this.collection.summary.total, 10);

		let text = '';

		switch (this.collection.type) {
			case 'deal':
				text = _.ngettext('%d deal', '%d deals', count, count);
				break;
			case 'organization':
				text = _.ngettext('%d organization', '%d organizations', count, count);
				break;
			case 'person':
				text = _.ngettext('%d person', '%d people', count, count);
				break;
			case 'activity':
				text = _.ngettext('%d activity', '%d activities', count, count);
				break;
			default:
				text = '';
		}

		return text;
	},

	formatCounters: function(summary) {
		if (!this.summaryCounters[this.collection.type] || !summary.counters) {
			return summary;
		}

		const counters = _.cloneDeep(this.summaryCounters[this.collection.type]);
		const summaryList = _.cloneDeep(summary);

		_.forEach(counters, function(counter) {
			counter.count = summaryList.counters[counter.key];
		});

		summaryList.counters = _.filter(counters, function(item) {
			return item.count;
		});

		return summaryList;
	},

	isEmptySummary: function() {
		const summaryList = this.collection.getSummaryList();

		return _.reduce(
			summaryList,
			function(result, summaryDetail) {
				return result && _.isEmpty(summaryDetail);
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
				position: 'bottom',
				target: this.$el,
				data: this.formatCounters(this.collection.getSummaryList())
			}
		});
	},

	render: function() {
		const summary = this.collection.getSummary && this.collection.getSummary();

		if (_.isObject(summary) && summary.total > 0) {
			this.$el.html(
				this.template({
					summary,
					typeText: this.getTypeText()
				})
			);
		} else {
			this.$el.empty();
		}

		this.focus();
	}
});
