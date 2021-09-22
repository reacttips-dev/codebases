import { FilterActionTypes, FilterActions } from '../actions/filters';

export default function filters(state: Pipedrive.Filter[] = [], action: FilterActions) {
	switch (action.type) {
		case FilterActionTypes.ADD_FILTER:
			return [
				...state,
				{
					...action.payload,
				},
			];
		case FilterActionTypes.REMOVE_FILTER:
			return [...state.filter((filter) => filter.id !== action.payload)];
		case FilterActionTypes.UPDATE_FILTER:
			return state.map((filter) =>
				filter.id === action.payload.value ? { ...filter, name: action.payload.name } : filter,
			);

		default:
			return state;
	}
}
