import Immutable from 'seamless-immutable';
import { sidebarActions } from 'actions/contextualSupport';

const initialState = Immutable.from({
	display: false,
});

export default function(state = initialState, action) {
	if (action.type === sidebarActions.SUPPORT_SIDEBAR_TOGGLE) {
		return Immutable.merge(state, {
			display: action.display,
		});
	}

	return state;
}
