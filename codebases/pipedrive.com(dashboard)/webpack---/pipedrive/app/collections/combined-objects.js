'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const sortUtils = require('utils/sort-utils');
const DealsCollection = require('collections/deals');
const LeadsCollection = require('collections/leads');
const PersonsCollection = require('collections/persons');
const ProductsCollection = require('collections/products');
const OrganizationsCollection = require('collections/organizations');
const BulkEditModel = require('models/bulk-edit');

let local;

const filterParamsNames = ['everyone', 'user_id', 'filter_id', 'team_id'];

/**
 * Static members of {@link collection/CombinedObjects CombinedObjects}
 * @lends collections/CombinedObjects
 */
const CombinedObjectsStatic = {
	/**
	 * Available base object types
	 * @type {Array}
	 */
	baseTypes: ['deal', 'person', 'organization', 'product'],

	/**
	 * Map base type to models
	 * @type {Object}
	 * @enum {Object}
	 */
	collectionMap: {
		deal: DealsCollection,
		person: PersonsCollection,
		organization: OrganizationsCollection,
		product: ProductsCollection,
		lead: LeadsCollection
	},

	/**
	 * When column name is "person.name" to get which person you must check deal.person_id property
	 * @type {Object}
	 */
	idKeyByTypeMap: {
		person: 'person_id',
		organization: 'org_id',
		product: 'product_id',
		lead: 'lead_id'
	}
};

const CombinedObjects = Pipedrive.Collection.extend(
	/** @lends collections/CombinedObjects.prototype */ {
		/**
		 * Default CombinedObjects base type is deal
		 * @type {String}
		 */
		type: 'deal',

		comparator: '_server_order',

		/**
		 * Data that is pulled from BE in any case
		 */
		requiredFields: [
			// 'cc_email' needed for adding bcc address to emails
			'cc_email'
		],

		hasActiveFilter: false,

		/**
		 * Build combined objects URL
		 * @return {String} Returns complete URI
		 */
		url: function() {
			let apiUrl =
				app.config.api + CombinedObjects.collectionMap[this.type].getListApiEndpoint();

			const fields = this.getFieldsArray();

			apiUrl += fields.length ? `:${this.buildStringFromFields(fields, this.type)}` : '';

			return apiUrl;
		},

		/**
		 * This is a magic collection that pulls data form different objects.
		 * It uses {@link collections/CombinedObjects.type} as its base object
		 * and creates nested objects based on the configuration of the API
		 * URI.
		 *
		 * @class Combined objects collection class
		 * @constructs
		 * @augments module:Pipedrive.Collection
		 *
		 * @param {Object} models      Models to prefill in a collection
		 * @param {Object} options     Options to set for the Combined Objects
		 *                             collection. See
		 *                             {@link collections/CombinedObjects#options this.options}.
		 * @param {String} options.type
		 * @param {Object} options.fields
		 * @void
		 */
		initialize: function(models, options) {
			/**
			 * Options used in the Combined Objects collection.
			 *
			 * @type {Object}
			 * @prop {String} type   Base type of the collection rows
			 * @prop {Array}  fields Fields to query from the API
			 */
			this.options = _.assignIn({}, options);
			this.options.customModelMatchers = this.options.customModelMatchers || [];
			this.options.data = {};
			this.hasAlphabet = this.options.alphabet;

			if (
				this.options.hasOwnProperty('type') &&
				_.includes(CombinedObjects.baseTypes, this.options.type)
			) {
				local.setBaseType.call(this, this.options.type);
			}
		},

		/**
		 * Combined objects format is non-standard. Here is attempt to write it back to our standard API format.
		 * Also if inline objects have been converted to models, update those as well
		 */
		updateRelatedObjects: function(response, options) {
			if (response && response.hasOwnProperty('related_objects')) {
				// rewrites response!
				_.forEach(
					response.data,
					_.bind(function(row) {
						_.forEach(
							CombinedObjects.idKeyByTypeMap,
							_.bind(function(idKey, type) {
								const object = row[type];

								if (object) {
									// here we merge combined objects result inline data with combined objects result related object
									const relatedobjects = response.related_objects[type];
									const data = _.assignIn({}, object, relatedobjects[object.id]);

									relatedobjects[object.id] = data;

									// store person / organization ids, otherwise we wouldn't have them in case corresponding
									// column not selected by user
									row[idKey] = row[type].id;

									// and delete combined object unusual deal property called object
									delete row[type];

									// if related object is already converted to model, update it also!
									const relatedModel = this.getCachedRelatedModel(
										type,
										object.id
									);

									if (relatedModel) {
										relatedModel.set(data);
									}
								}
							}, this)
						);
					}, this)
				);
			}

			// call original method
			Pipedrive.Collection.prototype.updateRelatedObjects.call(this, response, options);
		},

		bindSocketEvents: function() {
			app.global.bind(`${this.type}.model.*.add`, local.addModel, this);
			app.global.bind(`${this.type}.model.*.update`, local.updateModel, this);
			app.global.bind(`${this.type}.model.*.delete`, local.removeModel, this);
		},

		unbindSocketEvents: function() {
			app.global.unbind(`${this.type}.model.*.add`, local.addModel, this);
			app.global.unbind(`${this.type}.model.*.update`, local.updateModel, this);
			app.global.unbind(`${this.type}.model.*.delete`, local.removeModel, this);
		},

		/**
		 * Checks if model Maches current active filter.
		 * @param  {module:Pipedrive.Model}  model Deal, Activity, Person or
		 *                                         Organization model. Must
		 *                                         have model.meta data.
		 * @return {boolean}
		 */
		matchesConditions: function(model) {
			/** @type {Object} Filter to match against */
			const filter = this.options.filter;

			/** @type {String} First letter to match */

			const firstLetter = this.options.firstLetter;
			const cachedRequestParams = this.options.data;

			if (!model || !_.isObject(filter)) {
				return true;
			}

			const matchesDefaults = this.matchesDefaultFilters(filter, model, firstLetter);
			const matchesCustom = this.matchesCustomFilters(cachedRequestParams, model);

			return matchesDefaults && matchesCustom;
		},

		matchesDefaultFilters: function(filter, model, firstLetter) {
			const defaultMatchers = [
				local.matchesCurrentUser,
				local.matchesCurrentFilter,
				local.matchesFirstLetter
			];

			return _.reduce(
				defaultMatchers,
				(isMatching, matcher) => {
					return isMatching && matcher(filter, model, firstLetter);
				},
				true
			);
		},

		matchesCustomFilters: function(cachedRequestParams, model) {
			return _.reduce(
				this.options.customModelMatchers,
				(isMatching, matcher) => {
					if (!_.isFunction(matcher)) {
						return isMatching;
					}

					return isMatching && matcher(cachedRequestParams, model);
				},
				true
			);
		},

		composeFields: function(fields) {
			let allFields = fields;

			if (
				CombinedObjects.collectionMap[this.type] &&
				_.isFunction(CombinedObjects.collectionMap[this.type].includeFields)
			) {
				allFields = _.union(
					allFields,
					CombinedObjects.collectionMap[this.type].includeFields(allFields)
				);
			}

			return this.toCombinedObjectsFormat(allFields);
		},

		/**
		 * Override default pull functionality to filter out requested fields
		 * from the pull options
		 *
		 * @param {Object} options   Pull options to use. This collection also
		 *                           accepts `options.fields` to build proper
		 *                           combinedObjects API URI dynamically.
		 * @returns {XMLHttpRequest} Returns XHR object
		 */
		pull: function(options) {
			options = _.isObject(options) ? options : {};

			// Pick fields from options if provided
			if (options.hasOwnProperty('fields')) {
				this.options.fields = this.composeFields(options.fields);
				delete options.fields;
			}

			// Pick default or initialized type of not provided on pull
			if (!options.hasOwnProperty('data')) {
				options.data = {};
			}

			options.data = local.applyPreviousRequestParams.call(this, options.data);

			const hasUserFilter = options.data.user_id && +options.data.user_id !== User.get('id');

			// Is active filter used with pull request
			this.hasActiveFilter = hasUserFilter || options.data.filter_id || options.data.team_id;

			// If type was not specified or is invalid, use default or
			// initialized type
			this.injectPullDataType(options.data);

			const sortParameters = ['sort', 'objects_sort'];

			sortParameters.forEach((sortParameter) => {
				if (options.data[sortParameter]) {
					const removeNameFieldFromSortParameters = false;

					options.data[sortParameter] = sortUtils.applySortFieldsMapping(
						options.data[sortParameter],
						removeNameFieldFromSortParameters
					);
				}
			});

			local.cacheRequestParams.call(this, options.data);

			return Pipedrive.Collection.prototype.pull.call(this, options);
		},

		bulkDelete: function(filter) {
			const params = {};
			const bulkEditModel = new BulkEditModel(
				{},
				{
					type: this.type
				}
			);

			params[`${filter.type}_id`] = filter.value;

			bulkEditModel.destroy({
				ids: JSON.stringify(params)
			});
		},

		/**
		 * Returns columns to be changed on eg. person_id/org_id change.
		 *
		 * @param  {String}        type of the related columns we are after
		 * @return {Array}        Related columns in array, eg. ['person.name', 'person.owner_id', ...]
		 */
		getRelatedColumns: function(type) {
			const relatedFieldsData = _.find(this.options.fields, { type });
			const relatedFields = relatedFieldsData && relatedFieldsData.fields;

			return _.map(
				relatedFields,
				_.bind((fieldName) => {
					return `${type}.${fieldName}`;
				}, this)
			);
		},

		onUnload: function() {
			this.unbindSocketEvents();
		},

		/**
		 * Enrich pull with data type if not present. Also set last used data
		 * type as CombinedObject’s type.
		 *
		 * @param  {Object} data Data to prepare for pulling
		 * @void
		 */
		injectPullDataType: function(data) {
			if (!data.type || !_.includes(CombinedObjects.baseTypes, data.type)) {
				data.type = this.type;
			}

			local.setBaseType.call(this, data.type);
		},

		parse: function(response, options) {
			const parsed = Pipedrive.Collection.prototype.parse.call(this, response, options);

			if (this.additionalData && this.additionalData.hasOwnProperty('summary')) {
				this.setSummary(this.additionalData.summary);
			}

			return parsed;
		},

		/**
		 * Returns summary for ListView
		 * @return {Object}
		 */
		getSummary: function() {
			return this.summary;
		},

		setSummary: function(summary) {
			this.summary = {
				total: summary.total_count,
				formatted: summary.total_currency_converted_value_formatted,
				type: this.type,
				hasList: _.isObject(summary.values_total) || _.isObject(summary.counters)
			};

			this.summaryList = {
				total: _.sortBy(summary.values_total, 'value').reverse(),
				weighted: _.sortBy(summary.weighted_values_total, 'value').reverse(),
				counters: summary.counters
			};
		},
		/**
		 * Returns summarylist for ListView
		 * @return {Object}
		 */
		getSummaryList: function() {
			return this.summaryList;
		},

		/**
		 * Return array of fields to query from the combined objects API
		 * @return {Array} Returns an array of fields to query (default is empty)
		 */
		getFieldsArray: function() {
			return _.isArray(this.options.fields) ? this.options.fields : [];
		},

		/**
		 * Recursively builds string from nested object
		 * @param  {Object} fields Object to build the object from
		 * @return {String}        Return string built from object
		 */
		buildStringFromFields: function(fields, type) {
			let requiredFields = CombinedObjects.collectionMap[type].prototype.requiredFields;

			requiredFields = _.uniq(requiredFields.concat(this.requiredFields));

			// Add ownerKey to each request (for filter matching)
			requiredFields.push(CombinedObjects.collectionMap[type].prototype.getOwnerKey());

			return this.buildFieldsParams(fields, type, requiredFields);
		},

		buildFieldsParams: function(fields, type, requiredFields) {
			let bits = [];

			if (_.isArray(fields)) {
				_.forEach(
					fields,
					_.bind(function(field) {
						if (_.isObject(field)) {
							if (type === 'activity' && field.type === 'lead') {
								bits.push('lead');
							} else if (_.includes(CombinedObjects.baseTypes, field.type)) {
								bits.push(
									`${field.type}:${this.buildStringFromFields(
										field.fields,
										field.type
									)}`
								);
							}
						} else {
							const dependantFields = local.getDependantFields(field, type);

							if (!_.includes(bits, dependantFields)) {
								bits = _.uniq(bits.concat(dependantFields));
							}
						}
					}, this)
				);
			}

			// Always add required fields to fields list (for building models)
			_.forEach(requiredFields, (field) => {
				if (!_.includes(bits, field)) {
					bits.unshift(field);
				}
			});

			// LEAD-4731 - START - Remove after DB migration
			if (bits.includes('lead_title') && !bits.includes('lead_id')) {
				bits.push('lead_id');
			}

			if (bits.includes('lead_id') && !bits.includes('lead_title')) {
				bits.push('lead_title');
			}
			// LEAD-4731 - END - Remove after DB migration

			return `(${bits.join(',')})`;
		},

		/**
		 * Converts data column format to internal format
		 * @param  {Array} fields as ['name', 'title', 'person.name', 'person.id']
		 * @return {Array} ['name', 'title', {type: 'person', fields: ['name', 'id']}]
		 */
		toCombinedObjectsFormat: function(fields) {
			const list = [];

			_.forEach(fields, (field) => {
				if (_.isString(field) && field.indexOf('.') > -1) {
					const type = field.split('.')[0];
					const key = field.split('.')[1];

					// create grouped different model object

					const group = _.find(list, { type });

					if (group) {
						group.fields.push(key);
					} else {
						list.push({
							type,
							fields: [key]
						});
					}
				} else {
					list.push(field);
				}
			});

			return list;
		}
	},
	CombinedObjectsStatic
);

/**
 * Private methods of {@link collections/CombinedObjects}
 * @memberOf collections/CombinedObjects.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	/**
	 * Does the model match current user’s id
	 *
	 * @param  {Object}                 filter Filter to match against
	 * @param  {module:Pipedrive.Model} model  Model to check
	 * @return {boolean}                       Returns match result
	 */
	matchesCurrentUser: function(filter, model) {
		if (!filter.user_id) {
			return true;
		}

		const userIdValue = parseInt(model.getOwnerId(), 10);

		// Filter’s user_id matches User’s ID
		return parseInt(filter.user_id, 10) === userIdValue;
	},

	/**
	 * Does the model match current filter. If meta is missing, pass the
	 * check.
	 *
	 * @param  {Object}                 filter Filter to match against
	 * @param  {module:Pipedrive.Model} model  Model to check
	 * @return {boolean}                       Returns match result
	 */
	matchesCurrentFilter: function(filter, model) {
		if (!filter.filter_id) {
			return true;
		} else if (!_.isObject(model.meta) || !_.isObject(model.meta.matches_filters)) {
			return false;
		}

		const filterId = filter.filter_id;

		let matchingFilters = model.meta.matches_filters;

		// Use array 'current' of matching filters when exists. Caused by mismatch in
		// socket event (meta.matches_filters.current) and post request (meta.matches_filters)
		// responses (last one is used by mobiles as well).
		if (matchingFilters.current) {
			matchingFilters = matchingFilters.current;
		}

		// Filter ID exists
		return _.indexOf(matchingFilters, filterId) !== -1;
	},

	/**
	 * Does the model match current selected first letter
	 *
	 * @param  {Object}                 filter      Filter to match against
	 * @param  {module:Pipedrive.Model} model       Model to check
	 * @param  {String}                 firstLetter First letter to match
	 * @return {boolean}                            Returns match result
	 */
	matchesFirstLetter: function(filter, model, firstLetter) {
		if (!firstLetter || firstLetter === 'all') {
			return true;
		}

		// First letter matches model
		const modelFirstLetter = model.get('first_char') || local.getFirstLetter(model.get('name'));
		const currentFirstName = String(firstLetter);

		// we have to verify lower OR upper OR usual, because some languages (greek)
		// have issues with lower/upper case are actually different letters!

		return (
			modelFirstLetter === currentFirstName ||
			modelFirstLetter.toLowerCase() === currentFirstName.toLowerCase() ||
			modelFirstLetter.toUpperCase() === currentFirstName.toUpperCase()
		);
	},

	/**
	 * Adds given model to the collection. Checks that model matches current filter, is already in collection or is deleted.
	 * @param  {Object} model Deal, Activity, Person or Organization model.
	 * @param {boolean} recentlyCreated Recently created or not
	 */
	addModel: function(model, recentlyCreated = true) {
		const modelInCollection = this.find({ id: model.id });
		const matchesConditions = this.matchesConditions(model);
		const isModelDeleted = model.isDeleted();

		if (!isModelDeleted && !modelInCollection) {
			if (matchesConditions) {
				model.recentlyCreated = recentlyCreated;
				this.add(model);

				return;
			}

			if (local.matchesSelectedUserOrFilter.call(this, model)) {
				local.updateAlphabet.call(this, model);
			}
		} else if (modelInCollection && !matchesConditions) {
			this.remove(modelInCollection);
		} else if (modelInCollection) {
			modelInCollection.set(model);
		}
	},

	matchesSelectedUserOrFilter: function(model) {
		const filter = this.options.filter;
		const matchesCurrentFilter = local.matchesCurrentFilter.call(this, filter, model);
		const matchesCurrentUser = local.matchesCurrentUser.call(this, filter, model);

		return matchesCurrentFilter && matchesCurrentUser;
	},

	/**
	 * Checks if updated model should be added to current collection.
	 * @param  {Object} model Deal, Activity, Person or Organization model.
	 */

	updateModel: function(model) {
		const originatorUser = _.get(model, 'meta.user_id');
		const currentUser = User.get('id');

		const prevAttributes = model.previous;
		const prevModel = model.clone().set(prevAttributes);

		if (originatorUser === currentUser) {
			if (this.matchesConditions(model)) {
				local.addModel.call(this, model, false);
			} else {
				local.removeModel.call(this, model.get('id'));
			}
		}

		local.updateAlphabet.call(this, model, prevModel);
	},

	/**
	 * Removes model from collection. Checks if model exists in collection.
	 * @param  {Object} model Deal, Activity, Person or Organization model.
	 */
	removeModel: function(model) {
		const modelInCollection = this.find({ id: model });

		if (modelInCollection) {
			this.remove(modelInCollection);
		}
	},

	updateAlphabet: function(model, previousModel) {
		if (this.hasAlphabet) {
			if (previousModel && previousModel.get('name') === model.get('name')) {
				return;
			}

			this.trigger('update:alphabet', model);
		}
	},

	/**
	 * Figure out dependant fields for a specific field
	 *
	 * @param  {String} key Key of the field to check
	 * @param  {String} type  Type of the model (deal, person, organization)
	 * @return {Array}        Returns the field keys for displaying full
	 *                                data
	 */
	getDependantFields: function(key, type) {
		const fieldData = User.fields.getByKey(type, key);
		const fields = [];

		fields.push(key);

		// If subfields are defined
		if (fieldData && fieldData.hasOwnProperty('subfields') && fieldData.subfields !== null) {
			// From address subfields only lat and lang should be added (for map modal)
			if (fieldData.field_type === 'address') {
				_.forEach(fieldData.subfields, (f) => {
					if (_.endsWith(f.key, '_lat') || _.endsWith(f.key, '_long')) {
						fields.push(f.key);
					}
				});
			} else {
				_.forEach(fieldData.subfields, (f) => {
					fields.push(f.key);
				});
			}
		}

		if (fieldData && _.isObject(fieldData.mandatory_flag)) {
			_.forEach(_.keys(fieldData.mandatory_flag), (key) => {
				fields.push(key);
			});
		}

		return fields;
	},

	/**
	 * Set collections base model from the collection type
	 * @param {String} type Type of the base object
	 */
	setBaseType: function(type) {
		if (CombinedObjects.collectionMap.hasOwnProperty(type)) {
			this.unbindSocketEvents();
			this.model = CombinedObjects.collectionMap[type].prototype.model;
			this.type = type;
			this.bindSocketEvents();
		}
	},
	applyPreviousRequestParams: function(data) {
		if (_.intersection(_.keys(data), filterParamsNames).length > 0) {
			this.options.data = _.omit(this.options.data, filterParamsNames);
			this.additionalData = null;
		}

		return _.assignIn({}, this.options.data, data);
	},
	cacheRequestParams: function(data) {
		this.options.data = _.cloneDeep(data);
		local.cacheFilter.call(this, data);
		local.cacheFirstLetter.call(this, data);
	},
	cacheFilter: function(data) {
		if (_.intersection(_.keys(data), filterParamsNames)) {
			this.options.filter = _.cloneDeep(_.pick(data, filterParamsNames));
		}
	},
	cacheFirstLetter: function(data) {
		if (data.hasOwnProperty('first_char')) {
			this.options.firstLetter = data.first_char;
		}
	},
	/**
	 * Returns the first char of given string
	 * @param  {String} string String that is being processed
	 * @return {String}        First character of the string
	 */
	getFirstLetter: function(string) {
		if (_.isString(string)) {
			return string.charAt(0);
		}
	}
};

module.exports = CombinedObjects;
