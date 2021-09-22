const _ = require('lodash');
const Pipedrive = require('pipedrive');
const FieldView = require('views/lists/field');
const tableRowTemplate = require('templates/shared/table-row.html');

let local;

/**
 * TableRow states list
 * @memberOf views/shared/TableRow
 * @type {Object}
 * @enum {String}
 */
const states = {
	/**
	 * State of the View. Default
	 * @const
	 * @type {String}
	 */
	DEFAULT: 'default',
	/**
	 * State of the View. Saving state
	 * @const
	 * @type {String}
	 */
	SAVING: 'saving'
};

const TableRowView = Pipedrive.View.extend(
	/** @lends views/shared/TableRow.prototype */ {
		template: _.template(tableRowTemplate),
		states,

		/**
		 * @class Participants Table Row view
		 * @augments module:Pipedrive.View
		 * @constructs
		 *
		 * @example
		 * <caption>How TableRowItem is constructed for a table. Should be used
		 * from {@link views/Table Table} view</caption>
		 *
		 * const TableRow = new TableRowView({
		 *     model: participantModel,
		 *     tagName: 'tr',
		 *     className: 'participantRow'
		 * });
		 *
		 * @param {Object} options Options to set for the Table row view
		 * @returns {views/shared/TableRow} Returns itself for chaining.
		 */
		initialize: function(options) {
			/**
			 * Options used for rendering table view row item
			 * @type {Object}
			 * @prop {Object} columns `key:value` pairs of columns to render
			 * @prop {module:Pipedrive.Model} model Model to use
			 *       for data
			 * @prop {boolean} showActions Toggles whether to display actions
			 *       column or not
			 * @prop {function} handleRemoveClick Additional click handler for
			 *       row remove button
			 */
			this.options = options;
			this.columns = this.options.columns;
			this.customFieldViewClasses = this.options.customFieldViewClasses || {};
			/**
			 * Child views of the TableRowView. Each item is a View that
			 * renders a table cell contents from the model. Each of those
			 * views are {@link views/shared/Field Field}s.
			 * @type {Object}
			 */
			this.views = {};

			if (this.options.nonBlockingLoading) {
				setTimeout(_.bind(this.initChildViews, this), 0);
			} else {
				this.initChildViews();
			}

			this.state = TableRowView.states.DEFAULT;

			return this;
		},

		/**
		 * Initialize field views from each of the cells
		 * @void
		 */
		initChildViews: function() {
			_.forEach(this.options.columns, _.bind(local.addFieldView, this));
			local.bindModelEvents.call(this);

			this.render();

			if (this.options.isLastItem && _.isFunction(this.options.onLastRowRendered)) {
				this.options.onLastRowRendered();
			}
		},

		/**
		 * Renders participant row
		 * @returns {views/shared/TableRow} Returns itself for chaining.
		 */
		selfRender: function() {
			const columns = this.customView ? _.keys(this.customView.getColumns()) : this.columns;

			this.$el.html(
				this.template({
					model: this.model,
					columns,
					showActions: this.options.showActions,
					selectableRows: this.options.selectableRows,
					showEditColumns: this.options.showEditColumns
				})
			);
			local.bindEvents.call(this);

			if (this.model.get('_socketPending')) {
				local.setStateSaving.call(this);
				this.model.on('change:_socketPending', _.bind(local.clearStateSaving, this));
			}

			if (this.options.removeButtonTooltip) {
				local.setRemoveButtonTooltip.call(this);
			}

			return this;
		},

		onAttachedToDOM: function() {
			if (this.options.isLastItem && _.isFunction(this.options.onLastRowInDOM)) {
				this.options.onLastRowInDOM();
			}
		}
	},
	/** @lends views/shared/TableRow */ {
		states
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
	 * Handle click on the remove button. If custom remove click handler is
	 * defined ({@link views/shared/TableRow#options}`.handleRemoveClick`),
	 * call it. Returning `false` excplicitly will prevent model destuction
	 * @void
	 */
	handleRemoveClick: function() {
		if (
			_.isFunction(this.options.handleRemoveClick) &&
			this.options.handleRemoveClick(this.model) === false
		) {
			return;
		}

		this.model.destroy({ wait: true });
	},

	/**
	 * Bind UI events to controller
	 * @void
	 */
	bindEvents: function() {
		if (this.options.showActions) {
			this.$('.removeRow').on('click', _.bind(local.handleRemoveClick, this));
		}
	},

	bindModelEvents: function() {
		if (this.options.selectableRows) {
			this.model.on('selected', _.bind(local.setRowSelect, this));
		}

		this.model.on('request loading', _.bind(local.setStateSaving, this));
		this.model.on('sync', _.bind(local.clearStateSaving, this));
		this.model.on(
			'error',
			_.bind(function(model, response, options) {
				if (options.xhr.status === 400) {
					local.clearStateSaving.call(this);
				}
			}, this)
		);

		_.forEach(
			this.options.columnDependencies,
			_.bind(function(getRelatedColumns, idKey) {
				this.listenTo(
					this.model,
					`change:${idKey}`,
					_.bind(local.replaceSubModel, this, getRelatedColumns)
				);
			}, this)
		);
	},

	replaceSubModel: function(getRelatedColumns) {
		const relatedColumns = getRelatedColumns();

		_.forEach(
			relatedColumns,
			_.bind(function(columnName) {
				this.removeView(`td[data-field="${columnName}"]`);
				local.addFieldView.call(this, columnName);
			}, this)
		);

		this.render();
	},

	/**
	 * Triggers click on checkbox if chekcbox status is different from model rowSelected
	 */
	setRowSelect: function() {
		const checkbox = this.$('.selectRowInput input');

		if (checkbox.is(':checked') !== this.model.rowSelected) {
			checkbox.trigger('click');
		}

		if (checkbox.is(':checked')) {
			this.$el.addClass('selected');
		} else {
			this.$el.removeClass('selected');
		}
	},

	/**
	 * Create field view
	 * @param {String} columnName Field key of the column (model)
	 * @void
	 */
	addFieldView: function(columnName) {
		let model;

		if (this.model.submodel) {
			model = this.model[this.model.submodel];

			if (columnName.indexOf('.') > -1) {
				model = local.getSubmodel.call(this, model, columnName);
			}
		} else if (columnName.indexOf('.') > -1) {
			model = local.getSubmodel.call(this, null, columnName);
		} else {
			model = this.model;
		}

		if (model) {
			local.initFieldView.call(this, columnName, model);
		}
	},

	getSubmodel: function(model, columnName) {
		const keyParts = columnName.split('.');
		const modelType = keyParts[0];
		const modelKey = keyParts[1];

		let modelId;
		let subModel;

		if (model) {
			modelId = model.get(model.getRelationKeyByType(modelType));
			subModel = model.getRelatedModel(modelType, modelId);
		} else {
			modelId = this.model.get(this.model.getRelationKeyByType(modelType));
			subModel = this.model.getRelatedModel(modelType, modelId);
		}

		if (subModel) {
			local.ensureModelHasData.call(this, subModel, modelKey);
		}

		return subModel;
	},

	ensureModelHasData: function(model, modelKey) {
		const modelHasAttr = model.attributes.hasOwnProperty(modelKey);

		// Pull model data, if attribute in model not present
		if (!modelHasAttr && !model.pulling() && model.get('id')) {
			model.pull();
		}
	},

	initFieldView: function(columnName, model) {
		const FieldViewClass = this.customFieldViewClasses[columnName] || FieldView;

		this.addView(
			`td[data-field="${columnName}"]`,
			new FieldViewClass({
				tagName: 'td',
				key: columnName,
				model,
				relatedModel: this.model === model ? null : this.model,
				state: FieldView.states.READ,
				settings: {
					editable: false,
					popoverEditable: true,
					valueOnly: true
				},
				customTemplate: this.options.customTemplate,
				trackingData: {
					container_component: 'list_modal',
					object_id: model.id,
					object_type: model.type,
					parent_object_id: this.model.id,
					parent_object_type: this.model.type
				}
			})
		);
	},

	/**
	 * Emits row state change event on the model
	 */
	setState: function(state) {
		this.state = state;
		this.model.trigger('state_changed', state, this);
	},

	/**
	 * Sets view state to saving
	 * @void
	 */
	setStateSaving: function() {
		local.setState.call(this, TableRowView.states.SAVING);
		this.$el.addClass('saving');
	},

	/**
	 * Clears view state to default
	 * @void
	 */
	clearStateSaving: function() {
		local.setState.call(this, TableRowView.states.DEFAULT);
		this.$el.removeClass('saving');
	},

	/**
	 * Sets tooltips for delete buttons
	 * @void
	 */
	setRemoveButtonTooltip: function() {
		const tip = this.options.removeButtonTooltip;

		this.$('.removeRow').tooltip({
			tip,
			preDelay: 200,
			postDelay: 200,
			zIndex: 20000,
			fadeOutSpeed: 100,
			position: 'top',
			clickCloses: true
		});
	}
};

module.exports = TableRowView;
