const _ = require('lodash');

module.exports = (state = {}, { customView, mainContentWidth }) => {
	const newState = {};

	if (mainContentWidth) {
		newState.mainContentWidth = mainContentWidth;
	}

	if (customView) {
		newState.columns = customView.getColumnsFieldsArray();
	}

	return _.assign({}, state, newState);
};
