const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const FiltersView = require('views/shared/flow/filters');
const FlowItem = require('views/shared/flow/flow-item');
const SalesPhoneConnectionModel = require('models/flow/sales-phone-connection');
const ConferenceMeetingUtils = require('utils/conference-meeting-utils');
const CalendarSyncUtils = require('utils/calendar-sync-utils');
const Template = require('templates/shared/flow/flow-items.html');
const { isConferenceLinkEnabled } = require('utils/conference-meeting-utils');

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/flow-items.prototype */
	{
		template: _.template(Template),

		/**
		 * Flow filters instance
		 * @type {Filters}
		 */
		filters: null,

		/**
		 * model of which flow to show
		 * @type {Model}
		 */
		model: null,

		/**
		 * Collection of flow items
		 * @type {Object}
		 */
		collection: null,

		initialize: function(options) {
			this.options = _.assignIn({}, options);

			this.model = this.options.model;
			this.collection = this.options.collection;
			this.filters = this.options.filters;
			this.conferenceMeetingIntegrations = [];
			this.hasActiveCalendarSync = false;

			this.filters.on('change', this.render, this);
			this.collection.on('reset sort sync remove change', this.render, this);

			this.filtersView = new FiltersView({
				model: this.model,
				filters: this.filters
			});

			this.addView({
				'.flowFiltersWrapper': this.filtersView
			});
			this.initConferenceMeetingIntegration();
			this.getHasActiveCalendarSync();
			this.render();
		},

		templateHelpers: function() {
			return {
				model: this.model,
				collection: this.collection,
				collectionIsPulling: this.collection.pulling(),
				isEmptyFlow: this.isEmptyFlow(),
				focusItems: _.reverse(this.collection.getFocusItems()),
				doneItems: this.collection.getDoneItems()
			};
		},

		beforeRender: function() {
			const hasSalesPhoneItems = _.some(this.collection.models, (model) => {
				return model.get('data').call || model.get('data').reference_type === 'salesphone';
			});

			if (hasSalesPhoneItems) {
				SalesPhoneConnectionModel.getStatus();
			}

			this.createFlowItemViews();
		},

		afterRender: function() {
			if (
				!this.collection.isPulled() ||
				(this.collection.pulling() && this.collection.hasMore())
			) {
				this.showSpinner();
			} else {
				this.hideSpinner();
			}
		},

		initConferenceMeetingIntegration: async function() {
			if (isConferenceLinkEnabled(User.companyFeatures)) {
				this.conferenceMeetingIntegrations = await ConferenceMeetingUtils.getCachedInstalledVideoCallApps();

				this.createFlowItemViews(true);
				this.render();
			}
		},

		getHasActiveCalendarSync: async function() {
			const initialValue = this.hasActiveCalendarSync;

			this.hasActiveCalendarSync = await CalendarSyncUtils.hasActiveCalendarSync();

			if (initialValue !== this.hasActiveCalendarSync) {
				this.createFlowItemViews(true);
				this.render();
			}
		},

		createFlowItemViews: function(shouldUpdateActivity) {
			// ensure we have renderer for each collection item
			const items = this.collection.getFocusItems().concat(this.collection.getDoneItems());

			_.forEach(
				items,
				_.bind(function(item) {
					const selector = `.flowItemContainer[data-item-id="${item.id}"]`;
					const existingView = this.getView(selector);
					const addableItem = !existingView || existingView.model.cid !== item.cid;
					const notSalesPhoneItem = !(
						item.get('data').call || item.get('data').reference_type === 'salesphone'
					);
					// update activity item if user has:
					// video call integration installed - to display join button
					// active calendar sync - to display correct delete confirmation message
					const shouldUpdateItem =
						shouldUpdateActivity &&
						item.get('object') === 'activity' &&
						notSalesPhoneItem;

					// reuse renderers
					if (addableItem || shouldUpdateItem) {
						this.addView(
							selector,
							new FlowItem({
								model: item,
								relatedModel: this.model,
								salesPhoneModel: SalesPhoneConnectionModel,
								conferenceMeetingIntegrations: this.conferenceMeetingIntegrations,
								hasActiveCalendarSync: this.hasActiveCalendarSync
							})
						);
					}
				}, this)
			);
		},

		showSpinner: function() {
			this.$('.emptyView').removeClass('done');
		},

		hideSpinner: function() {
			this.$('.emptyView').addClass('done');
		},

		/**
		 * Check if there is something in the done or focus section in the flow
		 * @return {Boolean}
		 */
		isEmptyFlow: function() {
			const noFocusItems = this.collection.getFocusItems().length === 0;
			const doneItemsLength = this.collection.getDoneItems().length;
			const noDoneItems = doneItemsLength === 0;
			const nothingButAddtimeInPast =
				this.filters.filter === 'all' &&
				doneItemsLength === 1 &&
				this.collection.getDoneItems()[0].get('data').field_key === 'add_time';

			return noFocusItems && noDoneItems && nothingButAddtimeInPast;
		}
	}
);
