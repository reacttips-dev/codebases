const _ = require('lodash');
const rowHeight = 33;
const bufferSize = 20;

module.exports = {
	ROW_HEIGHT: rowHeight,
	renderBuffer: _.constant(bufferSize),
	SKELETON_MARGIN: 10,
	SKELETON_HEIGHT: 6,
	BACKGROUND_BORDER_COLOUR: '#E0E4E7'
};
