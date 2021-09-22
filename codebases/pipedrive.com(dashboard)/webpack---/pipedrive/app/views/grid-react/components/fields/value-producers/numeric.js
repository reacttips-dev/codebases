const _ = require('lodash');
const Formatter = require('utils/formatter');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);

	return _.isNumber(fieldValue) ? Formatter.formatNumber(fieldValue) : '';
};
