import Immutable from 'seamless-immutable';
import * as actions from 'actions/fullscreen';

const initialState = Immutable.from({
	content: null,
});

export default function(state = initialState, action) {
	switch (action.type) {
		case actions.FULLSCREEN_SHOW:
			return Immutable.merge(state, {
				content: action.content,
			});
		case actions.FULLSCREEN_CLOSE:
			return Immutable.merge(state, {
				content: null,
			});
		default:
			return state;
	}
}
