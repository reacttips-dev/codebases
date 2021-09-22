import immutable from 'seamless-immutable';
import * as ActionTypes from '../actions/lead';

export default function linkedLead(state = immutable({}), action) {
	switch (action.type) {
		case ActionTypes.API_GET_LINKED_LEAD_REQUEST: {
			return immutable.merge(
				state,
				{
					data: [],
					loading: true,
					error: false
				},
				{ deep: true }
			);
		}
		case ActionTypes.API_GET_LINKED_LEAD_SUCCESS: {
			return immutable.merge(
				state,
				{
					data: action.data || [],
					loading: false,
					error: false
				},
				{ deep: true }
			);
		}
		case ActionTypes.API_GET_LEAD_FAILURE:
		case ActionTypes.API_GET_LINKED_LEAD_FAILURE: {
			return immutable.merge(
				state,
				{
					loading: false,
					error: true
				},
				{ deep: true }
			);
		}
		case ActionTypes.UNLINK_LEAD: {
			return immutable.replace(
				state,
				{
					data: {},
					loading: false,
					error: false
				},
				{ deep: true }
			);
		}
		case ActionTypes.API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_REQUEST:
		case ActionTypes.API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_FAILURE:
		case ActionTypes.UPDATE_LEAD: {
			return immutable.merge(
				state,
				{
					data: action.data,
					loading: false,
					error: false
				},
				{ deep: true }
			);
		}
		default:
			return state;
	}
}
