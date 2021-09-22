import { actionTypes } from '../../shared/constants/action-types';

const initialDefaultState = {
	data: {},
	fetching: false
};

export const fields = (state = [], action) => {
	if (action.type === actionTypes.SET_FIELDS) {
		return action.data;
	}

	return state;
};

export const organization = (state = initialDefaultState, action) => {
	if (action.type === actionTypes.GET_ORGANIZATION_SUCCESS) {
		return {
			data: action.data,
			fetching: false
		};
	}

	if (action.type === actionTypes.GET_ORGANIZATION_REQUEST) {
		return {
			...state,
			fetching: true
		};
	}

	return state;
};

export const person = (state = initialDefaultState, action) => {
	if (action.type === actionTypes.GET_PERSON_SUCCESS) {
		return {
			data: action.data,
			fetching: false
		};
	}

	if (action.type === actionTypes.GET_PERSON_REQUEST) {
		return {
			...state,
			fetching: true
		};
	}

	return state;
};

export const fieldRecents = (state = [], action) => {
	if (action.type === actionTypes.SET_FIELD_PICKER_RECENTS) {
		return action.data;
	}

	return state;
};

export const linkedDeal = (state = initialDefaultState, action) => {
	if (action.type === actionTypes.GET_LINKED_DEAL_SUCCESS) {
		return {
			data: action.data,
			fetching: false
		};
	}

	if (action.type === actionTypes.GET_LINKED_DEAL_REQUEST) {
		return {
			...state,
			fetching: true
		};
	}

	return state;
};

export const fieldsSearchInputText = (state = '', action) => {
	if (action.type === actionTypes.FIELDS_SEARCH_INPUT_CHANGE) {
		return action.keyword;
	}

	return state;
};
