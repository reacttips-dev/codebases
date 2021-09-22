import { FilterActionTypes, SetSelectedFilterAction } from '../actions/filters';

export default function selectedFilter(state = null, action: SetSelectedFilterAction) {
	if (action.type === FilterActionTypes.SET_SELECTED_FILTER) {
		return action.payload;
	}

	return state;
}
