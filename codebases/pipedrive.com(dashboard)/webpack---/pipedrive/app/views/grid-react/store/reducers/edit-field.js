module.exports = (state = {}, action) => {
	return Object.assign({}, state, {
		isEditing: action.field
	});
};
