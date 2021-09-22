import Immutable from 'seamless-immutable';
import { articleActions } from 'actions/contextualSupport';

const initialState = Immutable.from({
	fetching: false,
	lastRequest: null,
	results: null,
	error: null,
});

export default function(state = initialState, action) {
	switch (action.type) {
		case articleActions.SUPPORT_SUGGESTIONS_REQUEST:
			return Immutable.merge(state, {
				fetching: true,
				results: null,
				lastRequest: action.url,
				error: null,
			});
		case articleActions.SUPPORT_SUGGESTIONS_RECEIVE:
			return Immutable.merge(state, {
				fetching: false,
				results: action.results,
				error: null,
			});
		case articleActions.SUPPORT_SUGGESTIONS_FAIL:
			return Immutable.merge(state, {
				fetching: false,
				results: null,
				error: action.error,
			});
		default:
			return state;
	}
}
