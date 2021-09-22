import { get } from 'lodash';

const FIELD_TRANSFORMATION_RULES = {
	location: (fieldValue) => get(fieldValue, 'description', fieldValue),
	organization: (fieldValue) => {
		if (typeof fieldValue === 'string') {
			return { id: null, name: fieldValue };
		}

		return fieldValue;
	},
	type: (value) => {
		if (typeof value === 'string') {
			return value;
		}

		return get(value, 'key_string', '');
	},
	attendees: (value) => value || [],
	participants: (value) => value || [],
};

const transformFieldValue = (field, value) => {
	if (field in FIELD_TRANSFORMATION_RULES) {
		return FIELD_TRANSFORMATION_RULES[field](value);
	}

	return value;
};

export { transformFieldValue };
