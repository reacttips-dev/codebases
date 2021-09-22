const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props, { returnFieldObject } = {}) => {
	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);
	const fieldValueId =
		isNaN(fieldValue) || typeof fieldValue === 'boolean'
			? fieldValue
			: parseInt(fieldValue, 10);
	const fieldOptions = _.isEmpty(field.options_deleted)
		? field.options
		: _.concat(field.options, field.options_deleted);
	const selectedOption = _.find(fieldOptions, { id: fieldValueId });

	if (returnFieldObject) {
		return selectedOption || null;
	}

	return selectedOption ? selectedOption.label : '';
};
