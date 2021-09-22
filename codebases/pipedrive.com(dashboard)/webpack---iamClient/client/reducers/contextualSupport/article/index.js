import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { articleActions } from 'actions/contextualSupport';

const initialState = Immutable.from({
	current: null,
	hasFailed: false,
});

export default function(state = initialState, action) {
	switch (action.type) {
		case LOCATION_CHANGE:
			return Immutable.merge(state, {
				hasFailed: false,
			});
		case articleActions.SUPPORT_ARTICLE_REQUEST:
			return Immutable.merge(state, {
				current: null,
			});
		case articleActions.SUPPORT_ARTICLE_RECEIVE:
			return Immutable.merge(state, {
				current: action.article,
			});
		case articleActions.SUPPORT_ARTICLE_FAIL:
			return Immutable.merge(state, {
				hasFailed: true,
			});
		default:
			return state;
	}
}
