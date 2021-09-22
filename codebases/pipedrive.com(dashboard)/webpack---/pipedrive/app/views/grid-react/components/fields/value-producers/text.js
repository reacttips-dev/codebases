const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	const { model, field } = props;

	return modelUtils.getModelAttribute(model, field.key, '');
};
