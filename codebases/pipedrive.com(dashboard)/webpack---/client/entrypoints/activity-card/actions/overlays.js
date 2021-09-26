export function showActivityCard() {
	return (dispatch, _, { webappApi }) => {
		const hideCard = () => dispatch(hideActivityCard());

		dispatch({ type: 'SHOW_ACTIVITY_CARD' });
		webappApi.router.on('routeChange', hideCard);
	};
}

export function hideActivityCard() {
	return (dispatch, getState, { onClose }) => {
		if (onClose) {
			setTimeout(onClose);
		}

		return dispatch({
			type: 'HIDE_ACTIVITY_CARD',
		});
	};
}

export function showDeleteConfirmation() {
	return {
		type: 'SHOW_DELETE_CONFIRMATION',
	};
}

export function hideDeleteConfirmation() {
	return {
		type: 'HIDE_DELETE_CONFIRMATION',
	};
}

export function openActivityEditModal() {
	return (dispatch, getState, { webappApi }) => {
		const activityId = getState().getIn(['activity', 'id']);

		webappApi.router.go(null, '#dialog/activity/edit', false, false, { activity: activityId });
		dispatch(hideActivityCard());
	};
}
