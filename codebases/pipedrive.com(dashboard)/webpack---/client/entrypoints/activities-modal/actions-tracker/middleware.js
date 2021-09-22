export const TRACKING_ACTION_NAME = 'TRACK_ACTION_HISTORY';

const trackActionsHistory = (store) => (middleware) => (action) => {
	if (action.type !== TRACKING_ACTION_NAME) {
		store.dispatch({
			type: TRACKING_ACTION_NAME,
			name: action.type,
		});
	}

	return middleware(action);
};

export { trackActionsHistory };
