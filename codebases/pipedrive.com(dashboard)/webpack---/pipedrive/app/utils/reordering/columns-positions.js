const $ = require('jquery');
const _ = require('lodash');
const TOLERANCE = 'intersect';
const tolerance = function(middle, edge) {
	return TOLERANCE === 'intersect' ? middle : edge;
};
const isInvalidCoordinate = function(coordinate) {
	return !_.isFinite(coordinate);
};
const ColumnsPositions = function ColumnsPositions() {
	this.positions = [];
};

ColumnsPositions.prototype.size = function() {
	return this.positions.length;
};

ColumnsPositions.prototype.reset = function(headers) {
	this.positions = _.reduce(
		headers,
		(positions, item, index) => {
			const $item = $(item);
			const itemWidth = $item.innerWidth();
			const left = $item.offset().left;
			const halfWidth = Math.round(itemWidth / 2);

			let leftPosition = Math.round(left);
			let leftEdge = leftPosition - halfWidth;

			const rightPosition = leftPosition + Math.round(itemWidth);
			const rightEdge = leftPosition + halfWidth;

			if (index > 0) {
				const previousPosition = positions[index - 1];

				leftPosition = previousPosition.r + 1;
				leftEdge = previousPosition.rightEdge + 1;
			}

			positions.push({
				l: leftPosition,
				r: rightPosition,
				leftEdge: tolerance(leftEdge, leftPosition),
				rightEdge: tolerance(rightEdge, rightPosition)
			});

			return positions;
		},
		[]
	);

	return this;
};

ColumnsPositions.prototype.indexFromCoordinates = function(x) {
	const lastPosition = _.last(this.positions);
	const firstPosition = _.first(this.positions);

	let index = _.findIndex(this.positions, (pos) => {
		return x >= pos.leftEdge && x <= pos.rightEdge;
	});

	if (index < 0 && x <= firstPosition.l) {
		index = 0;
	}

	if (index < 0 && x >= lastPosition.rightEdge) {
		index = this.positions.length;
	}

	return index;
};

ColumnsPositions.prototype.getGhostStartCoordinates = function(x, parentOffsetLeft = 0) {
	x = Number(x);
	const index = isInvalidCoordinate(x) ? 0 : this.indexFromCoordinates(x);
	const lastPosition = _.last(this.positions);
	const positionAtIndex = this.positions[index] || _.first(this.positions);

	return index < this.positions.length ? positionAtIndex.l - parentOffsetLeft : lastPosition.r;
};

module.exports = ColumnsPositions;
