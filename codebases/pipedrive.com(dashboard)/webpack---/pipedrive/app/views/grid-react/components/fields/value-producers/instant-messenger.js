const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');
const _ = require('lodash');
const formatValue = (fieldValue) => {
	const value = _.isObject(fieldValue) ? fieldValue.value : fieldValue;

	return {
		value,
		label: fieldWrapperUtils.formatValueLabel('im', fieldValue.label)
	};
};

module.exports = (props) => {
	const { model, field } = props;
	const fieldValues = modelUtils.getModelAttribute(model, field.key, []);

	if (_.isArray(fieldValues)) {
		return _.map(fieldValues, (fieldValue) => formatValue(fieldValue));
	} else {
		return [formatValue(fieldValues)];
	}
};
