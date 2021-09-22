const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');
const { getLinkAttribute, isContextualViewFullEnabled } = require('utils/contextual-view');
const _ = require('lodash');

const getRelatedModel = ({ model, relatedModels, field, fieldValue }) => {
	const { key, field_type: fieldType } = field;
	const relatedModelType = fieldWrapperUtils.BASIC_RELATED_FIELD_TYPES[key];
	const relatedModelTypeKey = `${relatedModelType}.${fieldValue}`;

	if (relatedModelType) {
		return relatedModels[relatedModelTypeKey];
	}

	return model.getRelatedModel(fieldType, Number(fieldValue));
};

module.exports = (props) => {
	const { field, model, relatedModels } = props;
	const fieldValue = modelUtils.getModelAttribute(model, field.key);
	const relatedModel = fieldValue
		? getRelatedModel({ model, relatedModels, field, fieldValue })
		: null;
	const displayAttribute = fieldWrapperUtils.getRelatedModelDisplayAttribute(field);
	const visualValue = {
		value: ''
	};

	visualValue.type = field.field_type;
	visualValue.id = fieldValue;

	if (relatedModel) {
		visualValue.value = relatedModel.get(displayAttribute);
		visualValue.linkAttributes = {
			'data-contextual-view': isContextualViewFullEnabled(model?.collection?.type),
			'href': getLinkAttribute(
				visualValue.type,
				visualValue.id,
				model?.collection?.type,
				model?.get('id'),
				relatedModel.getLink && relatedModel.getLink()
			)
		};
	} else if (fieldValue) {
		visualValue.value = _.gettext('(hidden)');
	}

	return visualValue;
};
