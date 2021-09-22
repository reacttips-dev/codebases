import { combineReducers } from 'redux';
import {
	SetShowByAction,
	SettingsActionTypes,
	SetArrangeByAction,
	SetChangeIntervalAction,
	SetNumberOfColumnsAction,
} from '../actions/settings';

const showBy = (state = 'add_time', action: SetShowByAction) => {
	if (action.type === SettingsActionTypes.SET_SHOW_BY_ACTION) {
		return action.payload;
	}

	return state;
};

const arrangeBy = (state = 'won', action: SetArrangeByAction) => {
	if (action.type === SettingsActionTypes.SET_ARRANGE_BY_OPTION) {
		return action.payload;
	}

	return state;
};

const changeInterval = (state = 'quarter', action: SetChangeIntervalAction) => {
	if (action.type === SettingsActionTypes.SET_CHANGE_INTERVAL_OPTION) {
		return action.payload;
	}

	return state;
};

const numberOfColumns = (state = 3, action: SetNumberOfColumnsAction) => {
	if (action.type === SettingsActionTypes.SET_NUMBER_OF_COLUMNS_OPTION) {
		return action.payload;
	}

	return state;
};

export default combineReducers({
	showBy,
	arrangeBy,
	changeInterval,
	numberOfColumns,
});
