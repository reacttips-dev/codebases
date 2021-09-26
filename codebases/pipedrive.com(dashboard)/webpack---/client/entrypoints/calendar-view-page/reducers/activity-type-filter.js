import { fromJS } from 'immutable';

export const initialState = fromJS({
	items: {},
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'ITEMS':
			return state.set('items', action.items);

		case 'TOGGLE_EXCLUDED': {
			const excluded = state.getIn(['items', action.keyString, 'excluded']);

			return state.setIn(['items', action.keyString, 'excluded'], !excluded);
		}

		case 'TOGGLE_ALL_EXCLUDED': {
			return state.withMutations((mutatingState) => {
				mutatingState.get('items').forEach((item) => {
					mutatingState.setIn(
						['items', item.get('key_string'), 'excluded'],
						action.isSelected,
					);
				});
			});
		}

		default:
			return state;
	}
};
