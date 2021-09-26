import { camelCase } from 'lodash';
import initialState from '../reducers/helpers/activity-initial-state';

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SET_ACTIVITY':
			return state.withMutations((mutatingState) =>
				[...action.activity.keys()].reduce(
					(accumulator, field) =>
						accumulator.set(camelCase(field), action.activity.get(field)),
					mutatingState,
				),
			);
		case 'FIELD_UPDATE':
			return state.set(action.field, action.value);
		default:
			return state;
	}
};
