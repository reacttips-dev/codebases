import { actionTypes } from '../constants/action-types';

export const setUserSelf = (userSelf) => (dispatch) => {
	dispatch({
		type: actionTypes.SET_USER_SELF,
		userSelf
	});
};
