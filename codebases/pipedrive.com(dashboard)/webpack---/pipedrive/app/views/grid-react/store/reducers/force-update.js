const _ = require('lodash');
const raf = require('utils/request-animation-frame');

module.exports = (state = {}, { whenDone }) => {
	const newState = _.assign({}, state, { collectionFetched: Date.now() });

	raf.request(whenDone);

	return newState;
};
