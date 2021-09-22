const Pipedrive = require('pipedrive');
const _ = require('lodash');
const tablePlaceholderTemplate = require('templates/shared/table-row-placeholder.html');

let local;

const TableLoadingView = Pipedrive.View.extend(
	/** @lends views/shared/TableLoading.prototype */ {
		template: _.template(tablePlaceholderTemplate),

		/**
		 * @class Participants Table Row view
		 * @augments module:Pipedrive.View
		 * @constructs
		 *
		 * @example
		 * <caption>How TableLoadingView is constructed for a table. Should be used
		 * from {@link views/Table Table} view</caption>
		 *
		 * var TableLoadingView = new TableLoadingView({
		 *     tagName: 'tr',
		 *     className: 'placeholderRow'
		 * });
		 *
		 * @param {Object} options Options to set for the Table row view
		 * @returns {views/shared/TableLoadingView} Returns itself for chaining.
		 */
		initialize: function(options) {
			/**
			 * Options used for generating table loading view
			 * @type {Object}
			 */
			this.options = _.assignIn({}, TableLoadingView.defaultOptions, options);

			// Can provide external template to this view
			if (this.options.template) {
				this.template = this.options.template;
			}

			return this;
		},

		getColspan: function() {
			if (this.options.customColumnsCount) {
				return this.options.customColumnsCount;
			} else {
				return (
					_.keys(this.options.columns).length +
					(this.options.selectableRows || 0) +
					(this.options.showEditColumns || 0) +
					(this.options.showActions || 0)
				);
			}
		},

		/**
		 * Renders participant row
		 * @returns {views/shared/TableLoadingView} Returns itself for chaining.
		 */
		render: function() {
			const colspan = this.getColspan();

			this.$el.html(
				this.template({
					colspan
				})
			);
			local.showSpinner.call(this);

			return this;
		},

		/**
		 * Unload method
		 * @private
		 * @void
		 */
		onUnload: function() {
			local.hideSpinner.call(this);
		}
	}
);

/**
 * Private methods of {@link views/shared/TableRow}
 * @memberOf views/shared/TableRow.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	/**
	 * Shows the spinner in the placeholder
	 * @void
	 */
	showSpinner: function() {
		this.$('.spinnerContainer').show();
	},
	/**
	 * Hides the spinner in the placeholder
	 * @void
	 */
	hideSpinner: function() {
		this.$('.spinnerContainer').hide();
	}
};

module.exports = TableLoadingView;
