'use strict';

const _ = require('lodash');
const Pipedrive = require('pipedrive');
const Template = require('templates/shared/flow/filters.html');
const User = require('models/user');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	initialize: function(options) {
		this.options = _.assignIn({}, options);

		this.model = this.options.model;
		this.filters = this.options.filters;

		this.filters.on('change', this.render, this);

		let onChangeFields = 'done_activities_count notes_count email_messages_count files_count';

		if (_.includes(['person', 'organization'], this.model.type)) {
			onChangeFields += ' won_deals_count lost_deals_count';
		}

		this.model.onChange(onChangeFields, this.render, this);

		this.render();
	},

	templateHelpers: function() {
		return {
			filterButtons: this.getFilterButtons()
		};
	},

	afterRender: function() {
		this.$('li:not(.disabled)').on('click', _.bind(this.onFilterClicked, this));
	},

	onFilterClicked: function(ev) {
		const filter = $(ev.currentTarget).data('filter');

		PDMetrics.trackUsage(null, 'person_details', 'tab_opened', {
			tab: filter
		});

		if (filter) {
			this.filters.setFilter(filter);
		} else {
			this.filters.reset();
		}
	},

	/**
	 * Generate buttons for each filter type.
	 * @return {Array}
	 */
	getFilterButtons: function() {
		const filterButtons = [];

		filterButtons.push({
			filter: 'all',
			text: _.gettext('All')
		});

		filterButtons.push({
			filter: 'activity',
			text: _.gettext('Activities'),
			count: this.model.get('done_activities_count'),
			disabled: !this.model.get('done_activities_count')
		});

		filterButtons.push({
			filter: 'note',
			text: _.gettext('Notes'),
			count: this.model.get('notes_count'),
			disabled: !this.model.get('notes_count')
		});

		filterButtons.push({
			filter: 'emailMessage',
			text: _.gettext('Emails'),
			// OLD-API-HACK: implement count and disable logic when deal object has new mail API mail_message_count
			// see: GOLD-1243
			disabled: false
		});

		/**
		 * check if all the supplied features are active
		 * @param flags {string[]}
		 * @return boolean
		 */
		const activeFlags = (flags) => flags.every((flag) => User.companyFeatures.get(flag));

		/**
		 * check if any of the supplied features are active
		 * @param flags {string[]}
		 * @return boolean
		 */
		const someActiveFlags = (flags) => flags.some((flag) => User.companyFeatures.get(flag));

		if (activeFlags(['marketing_app', 'flow_items_new_api']) && this.model.type === 'person') {
			filterButtons.push({
				filter: 'marketing',
				text: _.gettext('Marketing'),
				disabled: false
			});
		}

		if (User.companyFeatures.get('invoice_integration') && this.model.type === 'deal') {
			filterButtons.push({
				filter: 'invoice',
				text: _.gettext('Invoices'),
				disabled: false
			});
		}

		if (someActiveFlags(['docbase', 'docbase_grandfathered']) && this.model.type === 'deal') {
			filterButtons.push({
				filter: 'document',
				text: _.gettext('Documents'),
				disabled: false
			});
		}

		filterButtons.push({
			filter: 'file',
			text: _.gettext('Files'),
			count: this.model.get('files_count'),
			// Currently, files_count is not updated in case of mail v2.
			// So, the files filter is always enabled, even if empty.
			disabled: false // !this.model.get('files_count')
		});

		if (_.includes(['person', 'organization'], this.model.type)) {
			const wonCount = this.model.get('won_deals_count') || 0;
			const lostCount = this.model.get('lost_deals_count') || 0;
			const closedCount = wonCount + lostCount;

			filterButtons.push({
				filter: 'deal',
				text: _.gettext('Deals'),
				count: closedCount,
				disabled: !closedCount
			});
		}

		filterButtons.push({
			filter: 'change',
			text: _.gettext('Changelog')
		});

		this.applyButtonClasses(filterButtons);

		return filterButtons;
	},

	/**
	 * Adds classes array to buttons that should have some classes.
	 * @param  {Array} filterButtons
	 */
	applyButtonClasses: function(filterButtons) {
		_.forEach(
			filterButtons,
			_.bind(function(button) {
				const classes = [];

				if (this.filters.filter === button.filter) {
					classes.push('active');
				}

				if (button.disabled) {
					classes.push('disabled');
				}

				if (classes.length) {
					button.classes = classes;
				}
			}, this)
		);
	}
});
