import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { articleActions } from 'actions/contextualSupport';

const initialState = Immutable.from({
	fetching: false,
	sent: false,
	failed: false,
});

export default function(state = initialState, action) {
	switch (action.type) {
		case LOCATION_CHANGE:
			return Immutable.merge(state, {
				fetching: false,
				sent: false,
				failed: false,
			});
		case articleActions.SUPPORT_ARTICLE_FEEDBACK_SEND:
			return Immutable.merge(state, {
				fetching: true,
				sent: false,
				failed: false,
			});
		case articleActions.SUPPORT_ARTICLE_FEEDBACK_SUCCESS:
			return Immutable.merge(state, {
				fetching: false,
				sent: true,
				failed: false,
			});
		case articleActions.SUPPORT_ARTICLE_FEEDBACK_FAIL:
			return Immutable.merge(state, {
				fetching: false,
				sent: false,
				failed: true,
			});
		default:
			return state;
	}
}
