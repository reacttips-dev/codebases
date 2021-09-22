const _ = require('lodash');

module.exports = (state = {}, { amount, increase }) => {
	const { total } = state;

	return _.assign({}, state, { total: total + amount * increase });
};
