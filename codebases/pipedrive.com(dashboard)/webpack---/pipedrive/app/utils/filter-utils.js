const _ = require('lodash');
const VALID_FILTER_TYPES = ['user', 'filter', 'team'];
const FILTER_EQUALITY_KEYS = ['type', 'value', 'isTemp', 'isEdit', 'updated'];

const filterUtils = {
	isValid: function(filter) {
		const isEmpty = _.isEmpty(filter) || !_.isObject(filter);

		return !isEmpty && this.isValidType(filter) && this.isValidValue(filter);
	},
	isValidType: function(filter) {
		return _.indexOf(VALID_FILTER_TYPES, filter.type) !== -1;
	},
	isValidValue: function(filter) {
		const value = filter.value;
		const valueId = parseInt(value, 10);

		return valueId > 0 || value === 'everyone';
	},
	parse: function(filter) {
		let value;

		if (!filter) {
			return null;
		}

		const pieces = filter.match(/(filter|user|team)_(\d+)|all_users/);

		if (!pieces) {
			value = '';
		} else if (pieces[0] === 'all_users') {
			value = {
				type: 'user',
				value: 'everyone'
			};
		} else {
			value = {
				type: pieces[1],
				value: pieces[2]
			};
		}

		return value;
	},
	fromUrl: function() {
		const path = document.location.pathname;
		const filterParts = path.match(/\/(user|filter|team)\/(everyone|\d+)/);

		if (filterParts && filterParts.length === 3) {
			return {
				type: filterParts[1],
				value: filterParts[2]
			};
		}

		return null;
	},
	stringify: function(filter) {
		let value;

		if (!filter) {
			return null;
		}

		if (filter.type === 'user' && filter.value === 'everyone') {
			value = 'all_users';
		} else {
			value = `${filter.type}_${filter.value}`;
		}

		return value;
	},
	toQueryParams: function(filter) {
		const data = {};

		if (!filter) {
			return data;
		}

		const filterId = parseInt(filter.value, 10);

		if (filter.type === 'user') {
			if (filter.value === 'everyone') {
				data.everyone = 1;
			} else if (filterId) {
				data.user_id = filter.value;
			}
		} else if (filter.type === 'filter' && filterId) {
			data.filter_id = filterId;
		} else if (filter.type === 'team') {
			data.team_id = filter.value;
		}

		return data;
	},
	areEqual: function(one, another) {
		const oneToCompare = _.pick(one, FILTER_EQUALITY_KEYS);
		const anotherToCompare = _.pick(another, FILTER_EQUALITY_KEYS);

		return oneToCompare === anotherToCompare || _.isEqual(oneToCompare, anotherToCompare);
	},
	getMatchingFilterQueryParam: function() {
		const filter = this.fromUrl();

		if (filter && filter.type === 'filter') {
			return `get_matching_filters=${encodeURIComponent(filter.value)}`;
		}
	}
};

module.exports = filterUtils;
