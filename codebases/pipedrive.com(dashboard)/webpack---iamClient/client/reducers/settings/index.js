import Immutable from 'seamless-immutable';
import * as actions from 'actions/settings';

const initialState = Immutable.from({
	fetchHeaders: null,
	fetchUriPrefix: '',
});

export default function(state = initialState, action) {
	if (action.type === actions.SETTINGS_FETCH_HEADERS) {
		return Immutable.merge(state, {
			fetchHeaders: action.headers,
		});
	} else if (action.type === actions.SETTINGS_FETCH_URI_PREFIX) {
		return Immutable.merge(state, {
			fetchUriPrefix: action.uriPrefix,
		});
	}

	return state;
}
