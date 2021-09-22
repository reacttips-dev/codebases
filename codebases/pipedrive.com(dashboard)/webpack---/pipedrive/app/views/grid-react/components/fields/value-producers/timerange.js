const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	let subfieldValue;

	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);

	if (field.subfields && field.subfields[0]) {
		subfieldValue = modelUtils.getModelAttribute(model, field.subfields[0].key);
	}

	const value = fieldValue ? fieldWrapperUtils.formatTime(fieldValue) : '';
	const subValue = subfieldValue ? fieldWrapperUtils.formatTime(subfieldValue) : '';

	return fieldWrapperUtils.getFormattedRangeValue(value, subValue);
};
