const Pipedrive = require('pipedrive');
const sortUtils = require('utils/sort-utils');
const _ = require('lodash');
const MAX_SORTED_FIELDS = 3;

/**
 * Table Sorting helper class - helps to manage sorting
 *
 * @class utils/Table-sorting
 */

const TableSorting = function(...args) {
	this.initialize.apply(this, args);
};

/** @lends utils/Table-sorting.prototype */
_.assignIn(TableSorting.prototype, Pipedrive.Events, {
	// array of sorting objects
	sortedFields: [],
	reversedFields: [],
	defaultSortOrder: {},

	initialize: function(options) {
		this.defaultSortOrder = options.defaultSortOrder;
		this.sortedFields = [];
		this.reversedFields = [];
	},

	/**
	 * Helper for pulling collection data.
	 * Returns object of data to be sent to server.
	 *
	 * @return {object}
	 */
	getRequestData: function() {
		if (this.empty()) {
			return {};
		}

		return { sort: this.getSortOrder() };
	},

	getSortOrder: function() {
		return _.map(this.sortedFields, (field) => {
			const direction = this.getNewSortOrder(field, this.defaultSortOrder[field]);

			if (field.includes(',')) {
				return field
					.split(',')
					.map((subField) => `${subField} ${direction}`)
					.join(',');
			}

			return `${field} ${direction}`;
		}).join(',');
	},

	/**
	 * Get correct sorting order, reversed or not
	 * @param  {String} field               Field key
	 * @param  {String} currentSortingOrder Current sortingorder
	 * @return {String}                     New sorting order
	 */
	getNewSortOrder: function(field, currentSortingOrder) {
		if (this.isReversed(field)) {
			return this.getReverseSortOrder(currentSortingOrder);
		}

		return currentSortingOrder;
	},

	/**
	 * After API request set correct sort order to column
	 * @param {String} sorting        Includes sorted column key and direction
	 */
	setSortOrder: function(sorting) {
		this.sortedFields = [];
		this.reversedFields = [];

		_.forEach(sortUtils.parse(sorting), (sort) => {
			this.sortedFields.push(sort.field);

			if (sort.direction !== this.defaultSortOrder[sort.field]) {
				this.reversedFields.push(sort.field);
			}
		});
	},

	/**
	 * Helper for collection.comparator
	 * Local means don't pull more data - only sort what we have.
	 * This only supports sorting by one field atm.
	 *
	 * @todo Refactor this to be `getLocalSortComparator` so it doesn’t
	 *       need a reference to the collection.
	 * @param {collection} collection
	 */
	setLocalSortComparator: function(collection) {
		let field = this.sortedFields[0];

		const reversed = this.isReversed(field);

		if (field) {
			// this is ugly, but works. Submodel support should be hidden in collection?
			const submodel = collection.model.prototype.submodel;

			if (submodel) {
				field = `${submodel}.${field}`;
			}

			collection.setComparator(field, reversed);
			collection.sort();
		} else {
			collection.comparator = null;
		}
	},

	/**
	 * toggle sort direction for field
	 * @param  {String} field
	 * @void
	 */
	toggleDirection: function(field) {
		if (!this.contains(field)) {
			return;
		}

		if (this.isReversed(field)) {
			this.reversedFields = _.without(this.reversedFields, field);
		} else {
			this.reversedFields.push(field);
		}

		this.trigger('change', this);
	},

	/**
	 * Append second field to current sort. Removes previous secondary sort field
	 * @param  {String} field
	 * @void
	 */
	append: function(field) {
		this.sortedFields.push(field);

		if (this.sortedFields.length > MAX_SORTED_FIELDS) {
			// remove previous last field
			this.sortedFields.splice(MAX_SORTED_FIELDS - 1, 1);
		}

		this.trigger('change', this);
	},

	/**
	 * Set sort by one field
	 * @param  {String} field
	 * @param  {Boolean} reversed direction
	 * @void
	 */
	sort: function(field) {
		this.sortedFields = [field];
		this.reversedFields = _.without(this.reversedFields, field);

		this.trigger('change', this);
	},

	/**
	 * is current sorting empty
	 * @return {Boolean}
	 */
	empty: function() {
		return !this.sortedFields.length;
	},

	/**
	 * does sorting contain this field
	 * @param  {field} field
	 * @return {boolean}
	 */
	contains: function(field) {
		return _.includes(this.sortedFields, field);
	},

	/**
	 * is sorting for this field reversed
	 * @param  {String}  field
	 * @return {Boolean}
	 */
	isReversed: function(field) {
		return _.includes(this.reversedFields, field);
	},

	/**
	 * Get reversed sort order based on current sorting
	 * @param  {String} sortOrder Current order
	 * @return {String}           New sorting order
	 */
	getReverseSortOrder: function(sortOrder) {
		return sortOrder === 'asc' ? 'desc' : 'asc';
	},

	/**
	 * is field used as primary sort
	 * @param  {String}  field
	 * @return {Boolean}
	 */
	isPrimary: function(field) {
		return this.sortedFields[0] === field;
	},

	/**
	 * remove field from
	 * @param  {String} field
	 * @void
	 */
	remove: function(field) {
		if (this.contains(field)) {
			this.sortedFields = _.without(this.sortedFields, field);
			this.reversedFields = _.without(this.reversedFields, field);

			this.trigger('change', this);
		}
	},

	/**
	 * remove all sorting
	 * @void
	 */
	removeAll: function() {
		if (!this.empty()) {
			this.sortedFields = [];
			this.reversedFields = [];

			this.trigger('change', this);
		}
	},

	updateColumnsDefaultSortOrder: function(fields) {
		const existingFieldsKeys = _.keys(this.defaultSortOrder);

		_.forEach(fields, (field, key) => {
			if (!_.includes(existingFieldsKeys, key)) {
				this.defaultSortOrder[key] = _.clone(field);
			}
		});
	}
});

module.exports = TableSorting;
