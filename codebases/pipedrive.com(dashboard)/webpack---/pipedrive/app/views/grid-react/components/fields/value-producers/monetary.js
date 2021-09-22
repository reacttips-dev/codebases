const _ = require('lodash');
const Formatter = require('utils/formatter');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	let subfieldValue;

	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key, '');

	if (field.subfields && field.subfields[0]) {
		subfieldValue = modelUtils.getModelAttribute(model, field.subfields[0].key);
	}

	return _.isEmpty(subfieldValue) ? '' : Formatter.format(fieldValue, subfieldValue);
};
