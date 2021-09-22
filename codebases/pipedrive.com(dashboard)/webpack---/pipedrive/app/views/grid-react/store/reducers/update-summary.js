const _ = require('lodash');

module.exports = (state = {}) => {
	const { summary } = state;
	const total = (summary && summary.get('total_count')) || 0;

	return _.assign({}, state, { total });
};
