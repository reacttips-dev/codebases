const Stages = require('collections/pipeline/stages');
const modelUtils = require('views/grid-react/utils/model-utils');

module.exports = (props) => {
	const { model, field } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);
	const fieldValueId = isNaN(fieldValue) ? fieldValue : Number(fieldValue);
	const stage = Stages.getStageById(fieldValueId);

	return modelUtils.getModelAttribute(stage, 'name');
};
