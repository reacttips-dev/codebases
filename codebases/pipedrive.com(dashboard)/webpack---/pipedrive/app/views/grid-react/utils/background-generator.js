const $ = require('jquery');
const _ = require('lodash');
const BackgroundImageComposer = require('views/grid-react/utils/background-image-composer');
const gridConstants = require('views/grid-react/grid-constants');
const browserOffset = -1;
const gridLinear = (width, offset) => {
	return {
		image: `linear-gradient(to right, ${gridConstants.BACKGROUND_BORDER_COLOUR},
				${gridConstants.BACKGROUND_BORDER_COLOUR})`,
		size: `1px ${gridConstants.ROW_HEIGHT}px`,
		position: `${width + offset}px 0`
	};
};
const skeletonLinear = (width, offset) => {
	return {
		image: `linear-gradient(rgba(0, 0, 0, 0.05) ${gridConstants.SKELETON_HEIGHT}px, transparent 0 )`,
		size: `${width}px ${gridConstants.ROW_HEIGHT}px`,
		position: `${offset}px 16px`
	};
};

module.exports = {
	generateBackground(headerCells, includeSkeleton = true) {
		const backgroundComposer = new BackgroundImageComposer();
		const cellsAmount = headerCells.length;

		backgroundComposer.addLinear({
			image: `linear-gradient(to bottom, transparent ${gridConstants.ROW_HEIGHT - 1}px,
				${gridConstants.BACKGROUND_BORDER_COLOUR} 1px)`,
			size: `100% ${gridConstants.ROW_HEIGHT}px`,
			position: `0 0`
		});

		_.reduce(
			headerCells,
			(offset, item, index) => {
				const $item = $(item);
				const outerWidth = $item.outerWidth();
				const skeletonWith = Math.abs(outerWidth - gridConstants.SKELETON_MARGIN * 2);
				const skeletonOffset = offset + gridConstants.SKELETON_MARGIN;
				const isLastRow = index + 1 === cellsAmount;

				backgroundComposer.addLinear(gridLinear(outerWidth, offset));

				if (includeSkeleton && !isLastRow) {
					backgroundComposer.addLinear(skeletonLinear(skeletonWith, skeletonOffset));
				}

				return offset + outerWidth;
			},
			browserOffset
		);

		return _.assign({}, backgroundComposer.toCSS(), {
			backgroundRepeat: 'repeat-y'
		});
	}
};
