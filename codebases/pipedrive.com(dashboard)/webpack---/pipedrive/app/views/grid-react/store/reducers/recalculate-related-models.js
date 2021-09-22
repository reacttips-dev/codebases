const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
// we're not using reduce here, as it's much slower comparing to simple for/loop
const getRelatedModelsFromMatrix = ({ collectionItems, collection, columns, matrix }) => {
	const matrixSize = matrix.length;
	const relatedModels = {};
	const relatedModelsHash = [];

	for (
		let itemNr = 0, item = matrix[itemNr];
		itemNr < matrixSize;
		itemNr++, item = matrix[itemNr]
	) {
		const { index } = item;
		const modelId = collectionItems.at(index);

		if (!modelId) {
			continue;
		}

		relatedModels[modelId] = modelUtils.findRelatedModels({
			model: collection.get(modelId),
			columns
		});
		relatedModelsHash.push(..._.keys(relatedModels[modelId]));
	}

	return {
		relatedModels,
		relatedModelsHash
	};
};

module.exports = (state = {}) => {
	const { matrix, collectionItems, collection, columns } = state;

	return _.assign(
		{},
		state,
		getRelatedModelsFromMatrix({ collectionItems, collection, columns, matrix })
	);
};
