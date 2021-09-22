'use strict';
const _ = require('lodash');

const internals = {};

internals.idToKeyMap = {
	lead: {
		owner_id: 'owner_id.name'
	},
	person_id: 'person_name',
	org_id: 'org_name',
	related_person_id: 'related_person.name',
	related_org_id: 'related_org.name',
	deal_id: 'deal_title',
	lead_id: 'lead_title',
	user_id: 'user_name',
	owner_id: 'user_name',
	creator_user_id: 'creator_user_name',
	created_by_user_id: 'creator_user_name',
	stage_id: ['stages.order_nr', 'stages.name', 'pipeline.name'],
	pipeline_id: 'pipeline.name',
	label: 'label.name'
};

internals.parseSortParam = function(sortParameter) {
	const sortParts = sortParameter.split(' ');
	const sortField = sortParts[0];

	let sortDirection = sortParts[1] || 'asc';

	if (sortDirection !== 'asc') {
		sortDirection = 'desc';
	}

	return {
		field: sortField,
		direction: sortDirection
	};
};

function trimSortKey(sortKey) {
	return _.replace(sortKey, '.name', '');
}

/**
 * @return {string[]}
 */
internals.getIdToKeyMapSorting = function(sortDetails) {
	const sortDetailsParsed = sortDetails.field.split('.');
	const relatedItemFieldName = _.last(sortDetailsParsed);
	const relatedItemEntity = sortDetailsParsed.length > 1 && sortDetailsParsed[0];

	const fieldName = relatedItemFieldName || sortDetails.field;

	const entitySpecificMapping =
		internals.idToKeyMap[relatedItemEntity] &&
		internals.idToKeyMap[relatedItemEntity][fieldName];

	const mappingResult = entitySpecificMapping || internals.idToKeyMap[fieldName] || fieldName;

	const addDirection = function(field) {
		return `${sortDetails.field.replace(relatedItemFieldName, field)} ${sortDetails.direction}`;
	};

	if (_.isArray(mappingResult)) {
		return _.reduce(
			mappingResult,
			(result, field) => {
				result.push(addDirection(field));

				return result;
			},
			[]
		);
	}

	return [addDirection(mappingResult)];
};

/**
 * @return {string[]}
 */
internals.mapField = function(sortDetails) {
	const idToKeyMapping = internals.getIdToKeyMapSorting(sortDetails);

	return idToKeyMapping || [`${sortDetails.field} ${sortDetails.direction}`];
};

/**
 * Deduplicate sorting order to prevent errors when sending API requests.
 * @return {string[]}
 */
internals.getUniqueSortFields = (sortInfo) => {
	const removeDuplicateFields = (acc, cur) => {
		const field = _.fromPairs([cur.split(' ')]);

		return { ...acc, ...field };
	};

	return _.flatMap(sortInfo, internals.mapField).reduce(removeDuplicateFields, {});
};

module.exports = {
	parse: function(sortingString) {
		sortingString = sortingString || '';

		return _(sortingString.split(','))
			.map(_.trim)
			.filter(_.negate(_.isEmpty))
			.map(internals.parseSortParam)
			.value();
	},

	/**
	 *
	 * @param {*} sorting
	 * @param {boolean} removeNameFieldFromSorting Some endpoints support extended sorting parameter for single and multiple option fields,
	 * so it can be sorted by ".name" instead of by the field itself (which defaults to sorting by id). However, some endpoints
	 * do not support this sorting option and for those it needs to be cleaned.
	 */
	applySortFieldsMapping: function(sorting, removeNameFieldFromSorting = false) {
		const sortInfo = this.parse(sorting);
		const fields = internals.getUniqueSortFields(sortInfo);

		return Object.keys(fields)
			.map((key) => `${key} ${fields[key]}`)
			.map((key) => {
				if (removeNameFieldFromSorting) {
					return trimSortKey(key);
				}

				return key;
			})
			.join(',');
	},

	getSortKey: function(field, columnKey) {
		let result = columnKey;

		if (
			field.edit_flag &&
			['user', 'person', 'organization', 'enum', 'set'].includes(field.field_type)
		) {
			result += '.name';
		}

		return result;
	},

	trimSortKey
};
