const _ = require('lodash');

module.exports = (state = {}, { hoveredRowIndex }) => {
	const newState = { hoveredRowIndex };

	return _.assign({}, state, newState);
};
