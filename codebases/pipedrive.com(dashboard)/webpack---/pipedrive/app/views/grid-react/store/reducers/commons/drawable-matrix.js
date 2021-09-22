const gridMatrix = require('views/grid-react/utils/grid-matrix');
const topPositionCalculator = require('views/grid-react/utils/top-position-calculator');
const _ = require('lodash');

module.exports = (nextState) => {
	const { buffer, matrix, coveredRange, total } = nextState;

	nextState.drawableMatrix = gridMatrix
		.drawable({ buffer, matrix, coveredRange, total })
		.map((matrixItem) => {
			const { rowHeight, firstRowOffset, buffer, supportsTranslate } = nextState;
			const styles = topPositionCalculator.topPositionStyles({
				rowHeight,
				firstRowOffset,
				buffer,
				supportsTranslate,
				matrixItem
			});

			return _.assign(matrixItem, { styles });
		});

	return nextState;
};
