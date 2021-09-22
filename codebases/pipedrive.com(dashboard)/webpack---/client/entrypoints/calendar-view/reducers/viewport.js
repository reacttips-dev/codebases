import { fromJS } from 'immutable';

export const initialState = fromJS({
	width: 0,
	height: 0,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'UPDATE_VIEWPORT') {
		const { width, height } = action.viewport;
		const viewport = {};

		if (width) {
			viewport.width = width;
		}

		if (height) {
			viewport.height = height;
		}

		return state.merge(fromJS(viewport));
	}

	return state;
};
