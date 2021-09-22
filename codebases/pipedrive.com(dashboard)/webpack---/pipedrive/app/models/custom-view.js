const _ = require('lodash');
const sortUtils = require('utils/sort-utils');
const DryModel = require('models/dry-model');

const ignoredFields = {
	activity: ['due_time']
};

let local;

/**
 * Custom view model
 *
 * @classdesc
 * Stores information about list pages columns
 *
 * @class models/CustomView
 * @augments module:DryModel
 */

const CustomView = DryModel.extend(
	/** @lends models/CustomView.prototype */ {
		type: 'custom_view',

		selectedFields: [],

		initialize(data, options) {
			if (options && options.User) {
				this.setUser(options.User);
			}
		},

		setUser(User) {
			this.User = User;
		},

		url: function() {
			return `/api/v1/customViews/${this.id || ''}`;
		},

		/**
		 * Returns custom view columns object with key and localized name
		 * @example {
		 *          	'name':'Name',
		 *          	'org.address': 'Organization address'
		 *          }
		 * @return {Object}
		 */
		getColumns: function() {
			const columns = {};

			_.forEach(
				this.get('fields'),
				_.bind(function(field) {
					let userFields = this.User.fields.getByKeyWithSubFields(
						field.item_type,
						field.key
					);

					// LEAD-4731 - START - Remove after DB migration
					const validUserFields = userFields.filter(Boolean);

					if (
						!validUserFields.length &&
						field.item_type === 'activity' &&
						field.key === 'lead_id'
					) {
						userFields = this.User.fields.getByKeyWithSubFields(
							field.item_type,
							'lead_title'
						);
					}

					if (
						!validUserFields.length &&
						field.item_type === 'activity' &&
						field.key === 'lead_title'
					) {
						userFields = this.User.fields.getByKeyWithSubFields(
							field.item_type,
							'lead_id'
						);
					}
					// LEAD-4731 - END - Remove after DB migration

					if (field.item_type === this.get('view_type')) {
						// main model field
						userFields.map((userField) => {
							const name = userField.name || userField.label;

							columns[userField.key] = name;
						});
					} else {
						// some other related model field
						userFields.map((userField) => {
							const name = userField.name || userField.label;

							columns[`${field.item_type}.${userField.key}`] = name;
						});
					}
				}, this)
			);

			return columns;
		},

		/**
		 * Returns custom view columns object with all the data
		 *
		 * @return {Object}
		 */
		getColumnsFields: function() {
			return _.transform(
				this.getColumnsFieldsArray(),
				function(columnsFields, columnInfo) {
					columnsFields[columnInfo.key] = columnInfo.column;

					return columnsFields;
				},
				{}
			);
		},

		/**
		 * Returns custom view columns object with all the data, sorted the same order as fields
		 *
		 * @return {Array}
		 */
		getColumnsFieldsArray: function() {
			const self = this;

			return _.reduce(
				this.get('fields'),
				// eslint-disable-next-line complexity
				function(columnFields, field) {
					if (self.isIgnoredField(field.key)) {
						return columnFields;
					}

					let userField = _.cloneDeep(
						self.User.fields.getByKey(field.item_type, field.key)
					);

					// LEAD-4731 - START - Remove this after DB migration
					if (!userField && field.item_type === 'activity' && field.key === 'lead_id') {
						userField = _.cloneDeep(
							self.User.fields.getByKey(field.item_type, 'lead_title')
						);
					}

					if (
						!userField &&
						field.item_type === 'activity' &&
						field.key === 'lead_title'
					) {
						userField = _.cloneDeep(
							self.User.fields.getByKey(field.item_type, 'lead_id')
						);
					}
					// LEAD-4731 - END - Remove this after DB migration

					if (!userField) {
						return columnFields;
					}

					const columnInfo = {};

					if (!userField.name) {
						userField.name = userField.label;
					}

					if (field.width) {
						userField.width = field.width;
					}

					if (field.item_type === self.get('view_type')) {
						columnInfo.key = userField.key;
					} else {
						userField.isCrossItemField = true;
						columnInfo.key = `${field.item_type}.${userField.key}`;
					}

					userField.sortKey = sortUtils.getSortKey(userField, columnInfo.key);

					// For multiple option fields we add a secondary sort
					// so that the secondary items are also grouped together
					if (userField.field_type === 'set') {
						if (field.item_type === self.get('view_type')) {
							userField.sortKey += `,${userField.key}`;
						} else {
							userField.sortKey += `,${field.item_type}.${userField.key}`;
						}
					}

					columnInfo.column = userField;
					columnFields.push(columnInfo);

					return columnFields;
				},
				[]
			);
		},

		/**
		 * get sorted columns in API request format
		 * retuns string in format used by combined objects
		 * example: 'name asc, value desc'
		 *
		 * @return {String}
		 */
		getColumnsSortOrder: function() {
			let fields = _.filter(this.get('fields'), function(field) {
				return field.sort_sequence;
			});

			const columns = this.getColumnsFields();

			fields = _.sortBy(fields, 'sort_sequence');

			return _.map(
				fields,
				_.bind(function(field) {
					let fieldKey = local.getColumnFromField.call(this, field);

					// LEAD-4731 - START - Remove this after DB migration
					if (
						!columns[fieldKey] &&
						field.item_type === 'activity' &&
						field.key === 'lead_id'
					) {
						fieldKey = 'lead_title';
					}

					if (
						!columns[fieldKey] &&
						field.item_type === 'activity' &&
						field.key === 'lead_title'
					) {
						fieldKey = 'lead_id';
					}
					// LEAD-4731 - END - Remove this after DB migration

					const sortKey = sortUtils.getSortKey(columns[fieldKey], fieldKey);

					let sort = `${sortKey} ${field.sort_direction || 'asc'}`;

					// For multiple option fields we add a secondary sort
					// so that the secondary items are also grouped together
					if (columns[fieldKey].field_type === 'set') {
						sort += `,${fieldKey} ${field.sort_direction || 'asc'}`;
					}

					return sort;
				}, this)
			).join(',');
		},

		/**
		 * save sorted columns to custom view
		 * example: 'name asc, value desc'
		 * @param {String} sorting
		 * @param {Object} options
		 */
		setColumnsSortOrder: function(sorting, options) {
			// clear all previous sort orders
			const fields = _.map(this.get('fields'), function(field) {
				return _.omit(field, ['sort_sequence', 'sort_direction']);
			});

			// apply sort orders
			_.forEach(
				sortUtils.parse(sorting),
				_.bind(function(sort, i) {
					const fieldKey = sortUtils.trimSortKey(sort.field);
					const field = local.getFieldFromColumn.call(this, fieldKey, fields);

					if (!field) {
						return;
					}

					field.sort_sequence = i + 1;
					field.sort_direction = sort.direction;
				}, this)
			);

			this.set('fields', fields, options);
		},

		setColumnWidth: function(options) {
			const key = options.key;
			const field = local.getFieldFromColumn.call(this, key, this.get('fields'));

			field.width = options.width;
			this.saveSelectedFields(this.get('fields'));
		},

		saveSelectedFields: function(selectedFields, events) {
			const options = _.assign({ wait: true, silent: true }, events);

			let fields;

			if (_.isArray(selectedFields)) {
				this.set('fields', selectedFields, { silent: true });
			}

			if (selectedFields.length && !this.saving()) {
				// cleanup fields from extra info
				fields = _.map(selectedFields, function(field) {
					const f = _.pick(
						field,
						'item_type',
						'key',
						'sort_sequence',
						'sort_direction',
						'width'
					);

					f.key = local.applyAPIHacks(f.key);

					return f;
				});

				this.save('fields', fields, options);
			}
		},

		/**
		 * Resets the custom view columns (using param 'reset_fields')
		 * overrides success in order to reset "reset_fields" field of the object
		 * once data is retrieved
		 */
		setDefaultFields: function(events) {
			const self = this;
			const success = events.success;
			const dryRun = events.dryRun;
			const defaultCustomViewForType = this.User.customViews.getView(self.get('view_type'));

			if (dryRun) {
				return local.setFieldsFrom.call(self, defaultCustomViewForType, events);
			}

			events.success = function() {
				self.set('reset_fields', null, { silent: true });
				success();
			};
			self.save({ reset_fields: true }, events);
		},

		getDataColumns: function() {
			return _.keys(this.getColumns());
		},

		isIgnoredField: function(fieldKey) {
			const viewType = this.get('view_type');
			const hasIgnoredFields = _.has(ignoredFields, viewType);

			return hasIgnoredFields ? _.includes(ignoredFields[viewType], fieldKey) : false;
		},
		isAssignedToFilter: function() {
			return !!this.get('filter_id');
		},
		isEditable: function(currentFilter) {
			// can't require directly - circular ref err
			const hasFilter = this.isAssignedToFilter();
			const isFilterOwner = currentFilter && currentFilter.selfOwned();

			if (!hasFilter || isFilterOwner) {
				return true;
			}

			return this.User.settings.get('can_edit_shared_filters');
		}
	}
);

local = {
	/**
	 * Column format from field, example: {key:'name', view_type:'org'} -> org.name
	 * @param  {Object} field
	 * @return {String}
	 */
	getColumnFromField: function(field) {
		const itemType = field.item_type;
		const key = local.applyAPIHacks(field.key, true);

		return itemType === this.get('view_type') ? key : `${itemType}.${key}`;
	},

	/**
	 * Field from column format, example: org.name -> {key:'name', view_type:'org'}
	 * @param  {String} column
	 * @param  {Array} fields
	 * @return {Object}
	 */
	getFieldFromColumn: function(column, fields) {
		let type = this.get('view_type');
		let key = column;

		const parts = column.split('.');

		if (parts.length > 1) {
			type = parts[0];
			key = parts[1];
		}

		return _.find(fields || this.get('fields'), {
			item_type: type,
			key: local.applyAPIHacks(key)
		});
	},
	setFieldsFrom: function(viewToCopyFieldsFrom, options) {
		const fields = _.cloneDeep(viewToCopyFieldsFrom.get('fields'));

		this.save('fields', fields, options);
	},
	applyAPIHacks: function(key, isColumnToField) {
		if (isColumnToField && key === 'pipeline') {
			key = 'pipeline_id';
		} else if (key === 'pipeline_id') {
			key = 'pipeline';
		}

		return key;
	}
};

module.exports = CustomView;
