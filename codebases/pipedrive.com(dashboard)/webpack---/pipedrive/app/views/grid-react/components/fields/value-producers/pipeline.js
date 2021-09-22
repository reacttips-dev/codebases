const User = require('models/user');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);
	const fieldValueId = isNaN(fieldValue) ? fieldValue : Number(fieldValue);
	const pipeline = User.pipelines.getPipelineById(fieldValueId);

	return modelUtils.getModelAttribute(pipeline, 'name');
};
