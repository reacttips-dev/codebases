import { SnackbarActions, SnackbarActionTypes } from './actions';

export default (state = [], action: SnackbarActions) => {
	if (action.type === SnackbarActionTypes.ADD_SNACKBAR_MESSAGE) {
		return state.concat(action.payload);
	}

	if (action.type === SnackbarActionTypes.REMOVE_SNACKBAR_MESSAGE) {
		return state.filter((message) => message.key !== action.payload);
	}

	return state;
};
