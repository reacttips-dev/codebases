import { push, replace } from 'react-router-redux';

export default store => next => action => {
	if (action.meta && action.meta.route) {
		const state = store.getState();
		const currentPath = state.router.location.pathname;
		const newPath = action.meta.route.pathname;
		const replaceCurrent = state.router.location.state && state.router.location.state.replace;

		if (currentPath === action.meta.route.pathname || replaceCurrent) {
			store.dispatch(replace(newPath));
		} else {
			store.dispatch(push({
				pathname: newPath,
				state: {
					replace: action.meta.route.replace,
				},
			}));
		}
	}

	next(action);
};
