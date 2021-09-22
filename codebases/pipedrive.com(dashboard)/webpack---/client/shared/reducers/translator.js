import * as ActionTypes from '../actions/translator';

const translator = (state = {}, action) => {
	if (action.type === ActionTypes.SET_TRANSLATOR) {
		return action.translator;
	}

	return state;
};

export default translator;
