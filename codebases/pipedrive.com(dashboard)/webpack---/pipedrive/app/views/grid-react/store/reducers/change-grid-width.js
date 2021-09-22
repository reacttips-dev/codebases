const _ = require('lodash');

module.exports = (state = {}, { mainContentWidth, fixedContentWidth }) => {
	const newState = {};

	if (mainContentWidth) {
		newState.mainContentWidth = mainContentWidth;
	}

	if (fixedContentWidth) {
		newState.fixedContentWidth = fixedContentWidth;
	}

	return _.assign({}, state, newState);
};
