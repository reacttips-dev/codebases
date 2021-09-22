const _ = require('lodash');
const createNewMatrix = (topIndex, size) => {
	return _.map(_.range(topIndex, topIndex + size), (nr, counter) => {
		return { index: nr, key: counter, row: counter };
	});
};
const internals = {
	calculateDirection(oldRange, newRange) {
		const topMore = newRange.top >= oldRange.top;
		const bottomMore = newRange.bottom >= oldRange.bottom;

		return topMore && bottomMore ? 'down' : 'up';
	},
	calculateShift(oldRange, newRange) {
		return Math.abs(oldRange.top - newRange.top);
	},
	moveDown(matrix, firstIndex, shift) {
		const rowsCount = matrix.length;

		if (shift >= rowsCount) {
			return createNewMatrix(firstIndex, rowsCount);
		}

		let nextIndex = firstIndex + rowsCount - 1;

		return _.map(matrix, (line) => {
			const lineClone = _.cloneDeep(line);

			if (lineClone.index < firstIndex) {
				lineClone.index = nextIndex;
				nextIndex--;
			}

			lineClone.row = lineClone.index - firstIndex;

			return lineClone;
		});
	},
	moveUp(matrix, firstIndex, shift) {
		const rowsCount = matrix.length;

		if (shift >= rowsCount) {
			return createNewMatrix(firstIndex, rowsCount);
		}

		const maxIndex = firstIndex + rowsCount;

		let nextIndex = firstIndex;

		return _.map(matrix, (line) => {
			const lineClone = _.cloneDeep(line);

			if (lineClone.index >= maxIndex) {
				lineClone.index = nextIndex;
				nextIndex++;
			}

			lineClone.row = lineClone.index - firstIndex;

			return lineClone;
		});
	},
	rangeSize(range) {
		return Math.abs(range.bottom - range.top);
	},
	expandMatrix(matrix, sizeDiff) {
		const matrixSize = matrix.length;
		const nextKey = _.max(_.map(matrix, 'key')) + 1;
		const nextIndex = _.max(_.map(matrix, 'index')) + 1;
		const matrixExpansion = _.map(_.range(matrixSize, matrixSize + sizeDiff), (key, nr) => {
			const index = nextIndex + nr;

			return { index, key: nextKey + nr, row: key };
		});

		return _.concat(matrix, matrixExpansion);
	},
	contractMatrix(matrix, sizeDiff) {
		const newMatrixSize = matrix.length - sizeDiff;

		return _.reduce(
			matrix,
			(newMatrix, line) => {
				const lineClone = _.cloneDeep(line);

				if (lineClone.row >= newMatrixSize) {
					return newMatrix;
				}

				newMatrix.push(lineClone);

				return newMatrix;
			},
			[]
		);
	},
	pickPositive(matrix, amount) {
		return _(matrix)
			.sortBy('index')
			.filter((matrixItem) => matrixItem.index >= 0)
			.slice(0, amount)
			.value();
	}
};

let matrixConversions = [];

module.exports = {
	moveMatrix(matrix, oldRange, newRange) {
		const direction = internals.calculateDirection(oldRange, newRange);
		const shift = internals.calculateShift(oldRange, newRange);

		if (direction === 'down') {
			return internals.moveDown(matrix, newRange.top, shift);
		} else {
			return internals.moveUp(matrix, newRange.top, shift);
		}
	},
	resizeMatrix(matrix, oldRange, newRange) {
		const oldRangeSize = internals.rangeSize(oldRange);
		const newRangeSize = internals.rangeSize(newRange);
		const sizeDiff = Math.abs(newRangeSize - oldRangeSize);

		if (oldRangeSize < newRangeSize) {
			return internals.expandMatrix(matrix, sizeDiff);
		} else {
			return internals.contractMatrix(matrix, sizeDiff);
		}
	},
	drawable({ matrix, coveredRange, buffer, total }) {
		const rangeDisplaySize = Math.abs(coveredRange.bottom - coveredRange.top) - buffer * 2;
		const sliceNeeded = rangeDisplaySize > total;

		if (!sliceNeeded) {
			return matrix;
		}

		return internals.pickPositive(matrix, total);
	},
	prepareEmpty(size, buffer) {
		return createNewMatrix(-buffer, size + 2 * buffer);
	},
	stringify(matrix) {
		return _.map(matrix, (line) => `i:${line.index};k:${line.key};r:${line.row};`).join('\n');
	},
	printMatrix(matrix) {
		const header = `[index,key,row]`;
		const matrixData = _.map(matrix, (line) => `[${line.index},${line.key},${line.row}]`);

		matrixData.unshift(header);

		return matrixData.join('\n');
	},
	printMatrixDiff(matrixOne, matrixTwo) {
		const zippedMatrix = _.zip(matrixOne, matrixTwo);
		const matrixData = _.map(zippedMatrix, (zippedLine) => {
			const [lineOne, lineTwo] = zippedLine;

			return (
				`[${lineOne.index},${lineOne.key},${lineOne.row}] => ` +
				`[${lineTwo.index},${lineTwo.key},${lineTwo.row}]`
			);
		});
		const header = `[index,key,row] => [index,key,row]`;

		matrixData.unshift(header);

		return matrixData.join('\n');
	},
	cleanTransitions() {
		matrixConversions = [];
	},
	addTransition(matrix) {
		matrixConversions.push(matrix);
	},
	printTransitions() {
		const zippedMatrix = _.zip.apply(null, matrixConversions);
		const matrixData = _.map(zippedMatrix, (zippedLine) => {
			return _.map(zippedLine, (line) => {
				return `[${line.index},${line.key},${line.row}]`;
			}).join('\t=>\t');
		});

		return matrixData.join('\n');
	},
	printTransitionAt(index) {
		if (index - 1 > matrixConversions.length) {
			return;
		}

		return module.exports.printMatrix(matrixConversions[index]);
	}
};
