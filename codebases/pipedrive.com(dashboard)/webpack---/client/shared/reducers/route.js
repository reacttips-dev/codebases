import * as ActionTypes from '../actions/route';

export default function route(state = {}, action) {
	switch (action.type) {
		case ActionTypes.SET_ROUTE_CHANGE: {
			return { routeChanged: action.routeChanged };
		}
		case ActionTypes.SET_CURRENT_ROUTE: {
			return { currentRoute: action.route };
		}
		default:
			return state;
	}
}
