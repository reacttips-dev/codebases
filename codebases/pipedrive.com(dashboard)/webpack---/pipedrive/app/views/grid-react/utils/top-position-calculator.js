const topPosition = (properties) => {
	const { matrixItem, rowHeight, firstRowOffset, buffer } = properties;

	return firstRowOffset + (matrixItem.row - buffer) * rowHeight;
};
const topTranslateStyles = (properties) => {
	const { supportsTranslate } = properties;
	const result = {};

	result[supportsTranslate] = `translateY(${topPosition(properties)}px)`;

	return result;
};
const topAbsoluteStyles = (properties) => {
	return { top: `${topPosition(properties)}px` };
};

module.exports = {
	topPositionStyles(properties) {
		const { supportsTranslate } = properties;

		return supportsTranslate ? topTranslateStyles(properties) : topAbsoluteStyles(properties);
	}
};
