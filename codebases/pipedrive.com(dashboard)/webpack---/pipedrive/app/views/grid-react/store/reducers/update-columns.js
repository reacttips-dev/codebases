module.exports = (state = {}, action) => {
	return Object.assign({}, state, {
		columns: action.columns
	});
};
