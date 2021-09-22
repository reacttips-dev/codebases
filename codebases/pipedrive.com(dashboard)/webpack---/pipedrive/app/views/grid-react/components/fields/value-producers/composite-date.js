const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = ({ model, field }) => {
	const dateFieldValue = modelUtils.getModelAttribute(model, field.key);
	const timeFieldKey = field.key.replace('_date', '_time');
	const timeFieldValue = modelUtils.getModelAttribute(model, timeFieldKey);
	const fieldValue = timeFieldValue ? `${dateFieldValue} ${timeFieldValue}` : dateFieldValue;

	return fieldValue ? fieldWrapperUtils.formatDate(fieldValue, field.key, !!timeFieldValue) : '';
};
