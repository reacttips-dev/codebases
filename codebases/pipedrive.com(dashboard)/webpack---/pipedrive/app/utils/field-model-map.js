const _ = require('lodash');
const resolveFieldsClasses = function requireFieldsMap(fields) {
	const availableModels = {
		deal: require('models/deal'),
		lead: require('models/lead'),
		person: require('models/person'),
		organization: require('models/organization'),
		products: require('models/product')
	};

	return _.pick(availableModels, fields);
};
const fieldMapUtils = {};

fieldMapUtils.buildFieldModelMapFn = function buildFieldModelMapFn(fieldsMap) {
	let resolvedFieldClassesCache = null;

	return function(modelType) {
		if (!resolvedFieldClassesCache) {
			resolvedFieldClassesCache = resolveFieldsClasses(fieldsMap);
		}

		if (!modelType) {
			return resolvedFieldClassesCache;
		}

		return resolvedFieldClassesCache[modelType];
	};
};

module.exports = fieldMapUtils;
