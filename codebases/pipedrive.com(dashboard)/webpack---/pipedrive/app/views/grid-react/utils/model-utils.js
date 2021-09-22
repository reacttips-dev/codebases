const fieldWrapperUtils = require('./fields-utils');
const fieldTypeCalculator = require('./field-type-calculator');
const participantUtils = require('./participants-utils');
const _ = require('lodash');
const { isContextualViewFullEnabled } = require('utils/contextual-view');

const getModelAttribute = (model, attribute, defaultValue = '') => {
	if (model) {
		const attributeValue = model.get(attribute);

		return _.isNil(attributeValue) ? defaultValue : attributeValue;
	}

	return defaultValue;
};
const combineAttributes = (...attributes) => {
	const attributesLength = attributes.length;

	return ({ model }) => {
		let combinedAttribute = '';

		for (let attrIndex = 0; attrIndex < attributesLength; attrIndex++) {
			combinedAttribute += getModelAttribute(model, attributes[attrIndex], '');
		}

		return combinedAttribute;
	};
};
const getModelAttributeWithId = (model, attribute) => {
	return combineAttributes('id', attribute)({ model });
};
const isSubModelColumn = ({ columnKey }) => {
	return columnKey.indexOf('.') > -1;
};
const useSubModel = ({ model, columnKey }) => {
	if (!model) {
		return false;
	}

	return !!model.submodel || isSubModelColumn({ columnKey });
};
const detectDisplayModelType = ({ model, columnKey, modelType }) => {
	if (!useSubModel({ model, columnKey })) {
		return modelType;
	}

	if (model.submodel) {
		return modelType;
	}

	return columnKey.split('.')[0];
};
const calculateRegularAttributeValue = ({ model, columnKey, relatedModels, fieldType }) => {
	const subModelType = fieldWrapperUtils.BASIC_RELATED_FIELD_TYPES[columnKey];
	const subColumnKey = fieldWrapperUtils.RELATED_FIELD_ATTRIBUTE_BY_KEY[columnKey];
	const subModelId = model.get(columnKey);
	const relatedModel = relatedModels ? relatedModels[`${subModelType}.${subModelId}`] : null;
	const isIdDependentField = fieldTypeCalculator.isIdDependentField(fieldType);
	const attributeValueCalculator = isIdDependentField
		? getModelAttributeWithId
		: getModelAttribute;

	if (relatedModel) {
		const modelAttribute = attributeValueCalculator(relatedModel, subColumnKey, null);

		return `${modelAttribute}#${subModelId}`;
	}

	return attributeValueCalculator(model, columnKey, null);
};
const participantsAttributeCalculator = ({ model, columnKey, relatedModels, column }) => {
	const fieldType = fieldTypeCalculator.detectFieldType({ model, field: column });
	const isParticipantField = fieldType === participantUtils.fieldType;

	return isParticipantField
		? participantUtils.calculateParticipantsAttribute({ model, relatedModels })
		: calculateRegularAttributeValue({ model, columnKey, relatedModels, fieldType });
};
const phoneAttributeCalculator = ({ model, columnKey }) => {
	const phoneNumbers = getModelAttribute(model, columnKey, []);
	const modelId = getModelAttribute(model, 'id');

	if (_.isArray(phoneNumbers)) {
		return (
			modelId +
			phoneNumbers
				.map((phone) => {
					return `${phone.primary}#${phone.value}#${phone.label}`;
				})
				.join('##')
		);
	}

	return modelId + phoneNumbers;
};
const customAttributesCalculatorsByKey = {
	'activity:subject': combineAttributes('id', 'type', 'subject'),
	'activity:done': combineAttributes('id', 'done'),
	'activity:due_date': combineAttributes('due_date', 'due_time'),
	'activity:person_id': participantsAttributeCalculator,
	'person:phone': phoneAttributeCalculator
};
const getCustomAttributeCalculator = ({ modelType, columnKey }) => {
	return customAttributesCalculatorsByKey[`${modelType}:${columnKey}`];
};
const detectModelSpecificAttr = ({ model, column, columnKey, modelType, relatedModels }) => {
	if (!model) {
		return null;
	}

	const customAttributeCalculator = getCustomAttributeCalculator({ modelType, columnKey });

	if (customAttributeCalculator) {
		return customAttributeCalculator({ model, columnKey, relatedModels, column });
	}

	const fieldType = fieldTypeCalculator.detectFieldType({ model, field: column });
	const subFieldKey = fieldWrapperUtils.getSubFieldKey(column);
	const isSubFieldDependentField =
		fieldTypeCalculator.isSubFieldDependentField(fieldType) && subFieldKey;

	if (isSubFieldDependentField) {
		return combineAttributes(columnKey, subFieldKey)({ model });
	}

	return calculateRegularAttributeValue({ model, columnKey, relatedModels, fieldType });
};
const detectSubModelChangeableAttr = ({ columnKey, column, relatedModels }) => {
	const [modelType, subModelColumnKey] = columnKey.split('.');
	const model = relatedModels ? relatedModels[modelType] : null;

	return detectModelSpecificAttr({
		model,
		column,
		columnKey: subModelColumnKey,
		modelType,
		relatedModels
	});
};
const getSubModel = ({ columnKey, relatedModels }) => {
	if (relatedModels && relatedModels.generic) {
		return relatedModels.generic;
	}

	const [modelType] = columnKey.split('.');

	return relatedModels ? relatedModels[modelType] : null;
};
const detectModelToDisplay = ({ model, columnKey, relatedModels, columnItemType, modelType }) => {
	const isLeadColumn = columnKey?.includes('lead') || columnItemType === 'lead';
	const isActivityWithDeal = modelType === 'activity' && model?.get('deal_id');

	if (isLeadColumn && isActivityWithDeal) {
		return null;
	}

	if (!useSubModel({ model, columnKey })) {
		return model;
	}

	return getSubModel({ columnKey, relatedModels });
};
const detectModelChangeableAttr = ({ model, column, columnKey, modelType, relatedModels }) => {
	if (!useSubModel({ model, columnKey })) {
		return detectModelSpecificAttr({ model, column, columnKey, modelType, relatedModels });
	}

	if (relatedModels && relatedModels.generic) {
		return detectModelSpecificAttr({
			model: relatedModels.generic,
			column,
			columnKey,
			modelType
		});
	}

	return detectSubModelChangeableAttr({ columnKey, column, relatedModels });
};
const findRelatedModelsWithIds = ({ model, columnKeys }) => {
	return _.reduce(
		columnKeys,
		(relatedModels, columnKey) => {
			const modelType = fieldWrapperUtils.BASIC_RELATED_FIELD_TYPES[columnKey];

			if (!modelType) {
				return relatedModels;
			}

			const modelId = model.get(model.getRelationKeyByType(modelType));

			if (!modelId) {
				return relatedModels;
			}

			const relatedModel = model.getRelatedModel(modelType, modelId);

			if (relatedModel) {
				relatedModels[`${modelType}.${modelId}`] = relatedModel;
			}

			return relatedModels;
		},
		{}
	);
};
const findDefaultRelatedModels = ({ model, columnKeys }) => {
	const relatedModelsWithIds = findRelatedModelsWithIds({ model, columnKeys });
	const participants = getModelAttribute(model, participantUtils.modelAttribute, []);
	const relatedModels = _.transform(
		relatedModelsWithIds,
		(defaultRelatedModels, relatedModel, relatedModelKey) => {
			const [modelType] = relatedModelKey.split('.');

			defaultRelatedModels[modelType] = relatedModel;
			defaultRelatedModels[relatedModelKey] = relatedModel;

			return defaultRelatedModels;
		},
		{}
	);

	return participantUtils.addRelatedParticipants({ model, participants, relatedModels });
};
const findRelatedModels = ({ model, columns }) => {
	if (!model) {
		return {};
	}

	const columnKeys = _.map(columns, (column) => column.key);
	const defaultRelatedModels = findDefaultRelatedModels({ model, columnKeys });
	const relatedModels = _.reduce(
		columnKeys,
		(relatedModels, columnKey) => {
			if (!isSubModelColumn({ columnKey })) {
				return relatedModels;
			}

			const [modelType, subModelKey] = columnKey.split('.');
			const modelId = model.get(model.getRelationKeyByType(modelType));
			const relatedSubModel = model.getRelatedModel(modelType, modelId);

			if (!relatedSubModel) {
				return relatedModels;
			}

			const relatedSubModels = findRelatedModelsWithIds({
				model: relatedSubModel,
				columnKeys: [subModelKey]
			});

			_.assign(
				relatedModels,
				{
					[modelType]: relatedSubModel,
					[`${modelType}.${modelId}`]: relatedSubModel
				},
				relatedSubModels
			);

			return relatedModels;
		},
		defaultRelatedModels
	);

	if (model.submodel && model[model.submodel]) {
		relatedModels.generic = model[model.submodel];
	}

	return relatedModels;
};
const shouldShowNewBadge = (model, fieldKey) => {
	return (
		model &&
		model.isRecentlyCreated() &&
		fieldWrapperUtils.NAME_FIELD_MAP[model.type] === fieldKey
	);
};

module.exports = {
	modelToDisplay: detectModelToDisplay,
	modelChangeableAttr: detectModelChangeableAttr,
	displayModelType: detectDisplayModelType,
	findRelatedModels,
	getModelLink(model, fieldKey) {
		let link = '';

		const linkAttributes = ['name', 'title', 'subject', 'first_name', 'last_name'];

		if (model && _.includes(linkAttributes, fieldKey) && _.isFunction(model.getLink)) {
			if (model?.collection?.type === 'activity' && isContextualViewFullEnabled()) {
				link = `${window.location.pathname}?selected=${model.get('id')}&tab=activity`;
			} else {
				link = model.getLink();
			}
		}

		return link;
	},
	getModelContextualViewData(model, fieldKey) {
		const linkAttributes = ['name', 'title', 'subject', 'first_name', 'last_name'];

		if (model && _.includes(linkAttributes, fieldKey) && _.isFunction(model.getLink)) {
			return isContextualViewFullEnabled(model?.collection?.type);
		}

		return '';
	},
	getModelAttribute,
	getModelAttributeWithId,
	internals: {
		findRelatedModelsWithIds,
		findDefaultRelatedModels,
		detectModelSpecificAttr
	},
	shouldShowNewBadge
};
