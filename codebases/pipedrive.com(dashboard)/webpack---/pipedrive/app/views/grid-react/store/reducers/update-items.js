const _ = require('lodash');
const gridMatrix = require('views/grid-react/utils/grid-matrix');
const raf = require('utils/request-animation-frame');
const calculateFirstRowOffset = (scrollTop, rowHeight) => {
	return scrollTop - (scrollTop % rowHeight);
};

module.exports = (state = {}, { scrollTop, coveredRange, onComplete, collectionFetched }) => {
	const { matrix, rowHeight } = state;
	const oldCoveredRange = state.coveredRange;
	const movedMatrix = gridMatrix.moveMatrix(matrix, oldCoveredRange, coveredRange);
	const firstRowOffset = calculateFirstRowOffset(scrollTop, rowHeight);

	gridMatrix.addTransition(movedMatrix);

	const newState = _.assign({}, state, {
		scrollTop,
		coveredRange,
		matrix: movedMatrix,
		firstRowOffset
	});

	if (collectionFetched) {
		newState.collectionFetched = collectionFetched;
	}

	raf.request(onComplete);

	return newState;
};
