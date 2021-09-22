const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);

	return fieldValue ? fieldWrapperUtils.formatDuration(fieldValue) : '';
};
