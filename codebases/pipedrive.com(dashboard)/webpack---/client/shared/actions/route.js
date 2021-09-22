export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';
export const SET_ROUTE_CHANGE = 'SET_ROUTE_CHANGE';

export const setRouteChange = (route, newRoute) => (dispatch) => {
	dispatch({
		type: SET_ROUTE_CHANGE,
		routeChanged: route !== newRoute
	});
};

export const setCurrentRoute = (route) => (dispatch) => {
	dispatch({
		type: SET_CURRENT_ROUTE,
		route
	});
};
