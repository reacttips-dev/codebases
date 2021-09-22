const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	let subfieldValue, subfieldKey;

	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);

	if (field.subfields && field.subfields[0]) {
		subfieldKey = field.subfields[0].key;
		subfieldValue = modelUtils.getModelAttribute(model, subfieldKey);
	}

	const value = fieldValue ? fieldWrapperUtils.formatDate(fieldValue, field.key) : '';
	const subValue = subfieldValue ? fieldWrapperUtils.formatDate(subfieldValue, subfieldKey) : '';

	return fieldWrapperUtils.getFormattedRangeValue(value, subValue);
};
