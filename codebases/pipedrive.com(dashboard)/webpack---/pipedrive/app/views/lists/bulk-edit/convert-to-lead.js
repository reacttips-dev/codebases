const Pipedrive = require('pipedrive');
const _ = require('lodash');
const $ = require('jquery');
const convertToLeadTemplate = require('templates/lists/bulk-edit/convert-to-lead.html');
const BulkEditModel = require('models/bulk-edit');
const webappComponentLoader = require('webapp-component-loader');

let local;

/** @lends views/lists/ConvertToLeadView.prototype */
const ConvertToLeadView = Pipedrive.View.extend({
	template: _.template(convertToLeadTemplate),
	events: {
		'click .convertToLeadButton': 'openConvertModal'
	},
	/**
	 * Convert to lead View
	 *
	 * @class  Convert to lead View
	 * @constructs
	 * @augments module:Pipedrive.View
	 *
	 * @param {Object} options Options to set for the List view
	 * @returns {view/ConvertToLeadView} Returns itself for chaining
	 */
	initialize: function(options) {
		this.options = options || {};
		this.collection = this.options.collection;
		this.listSettings = this.options.listSettings;
		this.summary = this.listSettings.getSummary();
		this.selectAllFilter = this.options.collection.bulkEditFilter;
		this.selectedIds = this.options.collection.selectedIds;
		this.filterResultListIds = this.collection.models.map((model) => model.id);

		this.disabled = Boolean(
			this.selectedIds.length > 100 ||
				(this.selectAllFilter && this.filterResultListIds.length >= 100)
		);
		this.model = new BulkEditModel(
			{},
			{
				collection: this.collection,
				customView: this.listSettings.getCustomView()
			}
		);

		this.render();
	},

	selfRender: function() {
		this.$el.html(
			this.template({
				canConvertToLead: this.options.canConvertToLead,
				disabled: this.disabled
			})
		);

		this.$('[data-tooltip]').each(function() {
			const text = this.getAttribute('data-tooltip');

			if (text) {
				$(this).tooltip({
					tip: text,
					preDelay: 200,
					postDelay: 200,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'bottom-start',
					clickCloses: true
				});
			}
		});
	},

	openConvertModal: async function() {
		if (!this.disabled) {
			const modals = await webappComponentLoader.load('froot:modals');

			const dealIds = this.collection.selectedIds.length
				? this.collection.selectedIds
				: this.filterResultListIds.filter(
						(id) => !this.collection.excludedIds.includes(id)
				  );

			modals.open('leadbox-fe:convert-modal', {
				dealIds,
				view: 'List',
				onClose: function() {
					local.reset.call(this);
				}.bind(this)
			});
		}
	},

	remove: function() {
		this.undelegateEvents();
		this.$el.empty();
		this.stopListening();

		return this;
	}
});

local = {
	/**
	 * Hides button and unchecks all selected items.
	 * @void
	 */
	reset: function() {
		this.collection.selectedIds = [];
		this.collection.excludedIds = [];

		this.collection.trigger('selected', false);
	}
};

module.exports = ConvertToLeadView;
