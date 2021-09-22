const _ = require('lodash');
const { Model } = require('@pipedrive/webapp-core');

let local;

/**
 * Processes user fields for adapted format and provide easy interface
 * for the rest of the app.
 *
 * @classdesc UserFields model for easier handling
 * @class models/UserFields
 * @augments module:Model
 */
const UserFields = Model.extend(
	/** @lends models/UserFields.prototype */ {
		initialize: function() {
			const listenModels = [
				'field',
				'dealField',
				'personField',
				'organizationField',
				'productField'
			];

			listenModels.forEach((field) => {
				app.global.bind(`${field}.model.*.update`, this.fieldUpdate, this);
				app.global.bind(`${field}.model.*.add`, this.fieldUpdate, this);
				app.global.bind(`${field}.model.*.delete`, this.fieldDelete, this);
			});
		},
		/**
		 * Override to core set method.
		 *
		 * This `set()` method processes all the invalid field formats
		 * internally before setting them to the model. It handles both styles
		 * of arguments, same way as Backbone itself does.
		 *
		 * @see {@link http://backbonejs.org/#Model-set}
		 * @param {mixed}  key     Can be either a `String` or hash of
		 *                         `key:value` pairs
		 * @param {mixed}  val     If `String` key was used, it represents
		 *                         value. If hash, the it’s `options` instead
		 * @param {Object} options Hash of options passed to Backbone
		 * @return {models/UserFields} Returns itself as Backbone does
		 */
		set: function(key, val, options) {
			let attrs;

			if (key === null) {
				return this;
			}

			// Handle both `"key", value` and `{key: value}` -style arguments.
			if (typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}

			// Process fields and apply API hacks if needed
			_.forEach(attrs, (fields, key) => {
				local.processValues(key, fields);
			});

			return Model.prototype.set.call(this, attrs, options);
		},

		/**
		 * Returns fields information of a specific type
		 *
		 * This method is used for getting editable input fields for either a
		 * product, person or organization.
		 *
		 * If provided key is indicating specific field of a type, an object is
		 * returned instead.
		 *
		 * @example
		 * <caption>Different uses of get method</caption>
		 * // Returns array of fields
		 * var dealFields = User.fields.get('deal');
		 *
		 * // Returns specific field
		 * var personNameField = User.fields.get('person.name');
		 *
		 * // Returns array of fields without separate subfields
		 * var dealsFields = User.fields.get('deal', {skipSubfields: true});
		 *
		 * @param  {String} key    Type of fields to return (possible values
		 *                          product, person, organization)
		 * @param  {Object} options Options that can be used for getting fields
		 * @return {Array}
		 */
		get: function(key, options) {
			let fields;

			const bits = _.isString(key) ? key.split('.') : [];

			options = options || {};

			if (bits.length === 2) {
				return this.getByKey(bits[0], bits[1]);
			}

			// eslint-disable-next-line prefer-rest-params
			fields = Model.prototype.get.apply(this, arguments);

			if (_.isArray(options.blacklist)) {
				fields = _.filter(_.clone(fields), (field) => {
					return !_.includes(options.blacklist, field.key);
				});
			}

			return options.skipSubfields ? _.reject(fields, { is_subfield: true }) : fields;
		},

		/**
		 * Returns a specific field of a type
		 *
		 * Gets a specific field of a specified type object. Falls back to
		 * `use_field` if field was not found by `key`
		 *
		 * @see    {@link models/UserFields#get}
		 * @param  {String} type Type of fields to return (possible values
		 *                       product, person, organization)
		 * @param  {String} key  Input key to get the field information
		 * @return {Object}
		 */
		// eslint-disable-next-line complexity
		getByKey: function(type, key) {
			let field;

			let baseKey = key;

			const match = key.match(/^([0-9a-f]{40})_[_a-z0-9]+$/);

			// Match all subfields by parent has as well
			if (match) {
				baseKey = match[1];
			}

			// Search all top level fields
			field = _.find(this.get(type), { key: baseKey });

			// If there was a field, but key isn’t what we were looking for
			// then check for subfields
			if (field && field.key !== key && field.subfields) {
				field = _.find(field.subfields, { key });
			}

			// Try `use_field` property as well
			if (!field) {
				field = _.find(this.get(type), (f) => {
					return f.use_field === baseKey;
				});
			}

			// LEAD-4731 - START - Remove this after DB migration
			if (!field && type === 'activity' && key === 'lead_title') {
				field = _.find(this.get(type), { key: 'lead_id' });
			}

			if (!field && type === 'activity' && key === 'lead_id') {
				field = _.find(this.get(type), { key: 'lead_title' });
			}
			// LEAD-4731 - END - Remove this after DB migration

			return field;
		},

		/**
		 * Returns a specific field and it's subfields of a type
		 *
		 * Gets a specific field of a specified type object. Falls back to
		 * `use_field` if field was not found by `key`
		 *
		 * @see    {@link models/UserFields#get}
		 * @param  {String} type Type of fields to return (possible values
		 *                       product, person, organization)
		 * @param  {String} key  Input key to get the field information
		 * @return {Array}
		 */
		getByKeyWithSubFields: function(type, key) {
			const match = key.match(/^([0-9a-f]{40})_[_a-z0-9]+$/);

			let baseKey = key;

			if (match) {
				baseKey = match[1];
			}

			// Search all top level fields
			const field = _.find(this.get(type), { key: baseKey });

			let fields;

			if (field && field.subfields) {
				fields = [field, ...field.subfields];

				// This whole function was created due to changes in GraphQL where GQL stopped passing
				// these two properties which are required for google maps to work in list views.
				if (field.field_type === 'address') {
					fields.push({ key: `${baseKey}_lat` });
					fields.push({ key: `${baseKey}_long` });
				}
			} else {
				fields = [field];
			}

			// If there was a field, but key isn’t what we were looking for
			// then check for subfields
			if (field && field.key !== key && field.subfields) {
				fields = [_.find(field.subfields, { key })];
			}

			// Try `use_field` property as well
			if (!field) {
				fields = [
					_.find(this.get(type), (f) => {
						return f.use_field === baseKey;
					})
				];
			}

			return fields;
		},

		/**
		 * To check whether a field is editable.
		 *
		 * @param  {Object} field 				Field views field attribute.
		 * @param  {Object} model 				Model of that field.
		 * @param  {String} editableFieldKey
		 * @return {Boolean}
		 */
		isEditable: function(field, model, editableFieldKey) {
			const editableFieldKeyConditions = `${editableFieldKey}_conditions`;

			const editingAllowedList = ['pipeline_id', 'probability'];

			const inAllowedList = editingAllowedList.indexOf(field.key) !== -1;
			const isLeadCustomField = field.item_type === 'lead' && field.edit_flag;

			let isEditable = Boolean(
				(field[editableFieldKey] || inAllowedList) && !isLeadCustomField
			);

			if (field[editableFieldKey] && _.isObject(field[editableFieldKeyConditions])) {
				isEditable = this.matchesCondition(field, model, field[editableFieldKeyConditions]);
			}

			return isEditable;
		},

		matchesCondition: function(field, model, conditions) {
			if (!conditions) {
				return false;
			}

			const conditionKey = _.keys(conditions)[0];

			const conditionExp = conditions[conditionKey];

			const condition = conditionExp.match(/^(<=|<|>=|>|!|=)(.*)$/);

			// If no valid condition is provided from the API
			if (!condition) {
				return true;
			}

			const conditionOperator = condition[1];

			let conditionValue = condition[2];

			if (conditionValue.match(/^\d+$/)) {
				conditionValue = Number(conditionValue);
			} else if (conditionValue === 'null') {
				conditionValue = null;
			}

			return this.setMatchByConditionOperator(
				conditionOperator,
				conditionValue,
				conditionKey,
				model
			);
		},

		setMatchByConditionOperator: function(
			conditionOperator,
			conditionValue,
			conditionKey,
			model
		) {
			let matchesCondition = true;

			const modelConditionKey = model.get(conditionKey);

			switch (conditionOperator) {
				case '<=':
					matchesCondition = modelConditionKey <= conditionValue;
					break;
				case '<':
					matchesCondition = modelConditionKey < conditionValue;
					break;
				case '>=':
					matchesCondition = modelConditionKey >= conditionValue;
					break;
				case '>':
					matchesCondition = modelConditionKey > conditionValue;
					break;
				case '!=':
					matchesCondition = modelConditionKey !== conditionValue;
					break;
				case '=':
					matchesCondition = modelConditionKey === conditionValue;
					break;
				default:
					matchesCondition = true;
					break;
			}

			return matchesCondition;
		},

		/**
		 * Returns all fields for specified type
		 *
		 * @param  {String} type             Base type of the model
		 * @param  {String} fieldType        Field type to search for
		 * @param  {bool}   returnFirstMatch Returns only first found item
		 * @return {Array}                   Returns fields matching both model
		 *                                   and field types
		 */
		getByType: function(type, fieldType, returnFirstMatch) {
			const field = _[returnFirstMatch ? 'find' : 'filter'](this.get(type), {
				field_type: fieldType
			});

			return field;
		},

		/**
		 * Update single field data from event
		 * @param  {Model} model    fieldModel from event
		 * @void
		 */
		fieldUpdate: function(model) {
			if (model.isFieldModel && model.getType()) {
				const fieldType = model.getType();

				const index = _.findIndex(this.attributes[fieldType], { id: model.get('id') });

				const field = local.applyAPIHacks(model.toJSON(), fieldType);

				// If index exists, then update
				if (index >= 0) {
					this.attributes[fieldType][index] = field;
					this.trigger('update');
					this.trigger('changed');
				} else {
					this.attributes[fieldType].push(field);
					this.trigger('add');
				}
			}
		},
		fieldDelete: function(id, model) {
			if (model.isFieldModel && model.getType()) {
				const type = model.getType();

				const index = _.findIndex(this.attributes[type], { id });

				if (index >= 0) {
					this.attributes[type].splice(index, 1);
					this.trigger('delete');
					this.trigger('destroy');
				}
			}
		}
	}
);

/**
 * Private methods of {@link views/ListView}
 * @memberOf views/ListView.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	/**
	 * Processes all values and adds subfield references to basic fields
	 * @void
	 */
	processValues: function(key, fields) {
		let previous;

		const subfields = [];

		_.forEach(fields, (field) => {
			field = local.applyAPIHacks(field, key);

			// link to parent
			_.forEach(field.subfields, (subfield) => {
				subfield.parent = field;
			});

			if (field.is_subfield && previous) {
				if (!previous.hasOwnProperty('subfields') || previous.subfields === null) {
					previous.subfields = [];
				}

				field.parent = previous;
				local.applySubfieldHacks(field);
				previous.subfields.push(field);
			}

			_.forEach(field.subfields, (subfield) => {
				if (!subfield.is_subfield) {
					subfield.is_subfield = true;
					subfields.push(subfield);
				}
			});

			if (field.id) {
				previous = field;
			}
		});

		_.forEach(subfields, (subfield) => {
			local.applySubfieldHacks(subfield);
			fields.push(subfield);
		});

		// Add copy due_time as subfield of due_date.
		if (key === 'activity') {
			const dueDateField = local.getField(fields, 'due_date');

			const dueTimeField = local.getField(fields, 'due_time');

			const subjectField = local.getField(fields, 'subject');

			const typeField = local.getField(fields, 'type');

			if (dueDateField && dueTimeField) {
				dueDateField.subfields = [dueTimeField];
				dueTimeField.parent = dueDateField;
			}

			if (subjectField && typeField) {
				subjectField.subfields = [typeField];
				typeField.parent = subjectField;
			}
		}
	},

	getField: function(fields, key) {
		return _.find(fields, (field) => {
			return field.key === key;
		});
	},

	// eslint-disable-next-line
	applyAPIHacks: function(field, key) {
		const varcharHacks = ['email', 'im', 'phone', 'currency'];

		if (field.field_type === 'varchar' && _.includes(varcharHacks, field.key)) {
			field.field_type = field.key;
		}

		if (field.field_type === 'varchar' && field.key === 'deal_currency') {
			field.field_type = 'currency';
		}

		if (field.field_type === 'phone' && field.key !== 'phone') {
			field.phoneCustomField = true;
			field.field_type = 'varchar';
		}

		// SPECIAL CASE #3 for 'person'
		if (field.field_type === 'person' && !field.display_field) {
			field.display_field = field.key.replace('_id', '_name');
		}

		// SPECIAL CASE #4 for 'organiation'
		if (field.field_type === 'organization' && !field.display_field) {
			field.display_field = field.key.replace('_id', '_name');
		}

		if (field.field_type === 'org') {
			field.field_type = 'organization';
		}

		if (field.key === 'pipeline') {
			field.key = 'pipeline_id';
			field.use_field = 'pipeline';
			field.field_type = 'pipeline';
		}

		if (field.key === 'person_id' && key === 'activity') {
			field.field_type = 'participants';
			field.use_field = 'participants';
		}

		if (_.isObject(field)) {
			field.item_type = key;
		}

		return field;
	},

	applySubfieldHacks: function(subfield) {
		subfield.selectable =
			!_.endsWith(subfield.key, '_lat') && !_.endsWith(subfield.key, '_long');
	}
};

module.exports = UserFields;
