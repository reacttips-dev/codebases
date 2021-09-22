const _ = require('lodash');
const bothEmpty = (first, second) => {
	return !first && !second;
};
const oneIsEmpty = (first, second) => {
	return (first && !second) || (second && !first);
};
const shallowSameModels = (modelOne, modelTwo) => {
	if (bothEmpty(modelOne, modelTwo)) {
		return true;
	}

	if (oneIsEmpty(modelOne, modelTwo)) {
		return false;
	}

	return _.isEqual(Number(modelOne.get('id')), Number(modelTwo.get('id')));
};
const compareUtils = {
	shallowSameModels,
	modelChanged(oldModel, newModel) {
		const notSameModels = !shallowSameModels(oldModel, newModel);
		const modelIsChanged = !!newModel && newModel.hasChanged();

		return notSameModels || modelIsChanged;
	},
	hasDifference(first, second, ...properties) {
		return !!_.find(
			properties,
			(propertyName) => !_.isEqual(first[propertyName], second[propertyName])
		);
	}
};

module.exports = compareUtils;
