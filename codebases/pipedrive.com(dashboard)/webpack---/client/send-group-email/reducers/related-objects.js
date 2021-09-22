import merge from 'lodash/merge';

export default (state = {}, action) => {
	switch (action.type) {
		case 'SET_MESSAGES':
			return action.relatedObjects;
		case 'ADD_MESSAGES':
			return merge({ ...state }, action.relatedObjects);
		case 'RESET':
			return {};
		default:
			return state;
	}
};
